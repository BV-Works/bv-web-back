import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import {
  ROLES,
  AUTO_PROFILE_ROLES,
  PROFILE_TYPE_BY_ROLE,
} from '../constants/roles.constants.js';
import { generateUniqueSlug } from '../utils/slug.js';
import sequelize from '../config/db_pg.js';
import { generatePasswordResetToken } from './auth.service.js';
import { sendWelcomeEmail } from './mail.service.js';
import { env } from '../config/env.js';
// GET USERS - ADMIN ONLY

export const getUsersService = async ({
  limit = 10,
  page = 1,
  role,
  is_active,
}) => {
  const where = {};

  if (role) where.role = role;
  if (typeof is_active !== 'undefined') where.is_active = is_active;

  const offset = (page - 1) * limit;

  const { rows, count } = await User.findAndCountAll({
    where,
    limit,
    offset,
    attributes: {
      exclude: ['password_hash'],
    },
    order: [['created_at', 'DESC']],
  });

  return {
    rows,
    meta: {
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    },
  };
};

// GET USER BY ID - ADMIN ONLY

export const getUserByIdService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password_hash'] },
  });
  if (!user) {
    throw {
      statusCode: 404,
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    };
  }

  return user;
};

// CREATE USER (CORE LOGIC): De momento NO HAY REGISTRO PÚBLICO, solo creación por ADMIN o por seeders. Futuro registro con perfil CUSTOMER controlado por AUTH.

export const createUserService = async ({
  email,
  password,
  role = ROLES.CUSTOMER,
  is_active = true,
  sendInvitation = false,
}) => {
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    throw {
      statusCode: 409,
      message: 'Email already in use',
      code: 'EMAIL_ALREADY_EXISTS',
    };
  }

  const transaction = await sequelize.transaction();

  try {
    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create(
      {
        email,
        password_hash,
        role,
        is_active,
      },
      { transaction },
    );

    // AUTO PROFILE CREATION RULE:
    // Si eres ADMIN, TEAM o ARTIST, te creamos un perfil automáticamente

    if (AUTO_PROFILE_ROLES.includes(role)) {
      await Profile.create(
        {
          user_id: user.id,
          profile_type: PROFILE_TYPE_BY_ROLE[role],
          display_name: email.split('@')[0],
          slug: await generateUniqueSlug(email),
          is_public: true,
        },
        { transaction },
      );
    }

    await transaction.commit();

    // Send invitation email if requested
    if (sendInvitation) {
      try {
        const token = generatePasswordResetToken(user);

        const resetUrl = `${env.frontendUrl}/reset-password?token=${token}`;

        await sendWelcomeEmail({
          to: user.email,
          resetUrl,
        });
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }
    }

    const safeUser = user.toJSON();
    delete safeUser.password_hash;

    return safeUser;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

// UPDATE USER (ADMIN ONLY CONTROLLED)

export const updateUserService = async (id, data) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw {
      statusCode: 404,
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    };
  }

  // ⚠️ no permitimos tocar password aquí
  const allowedFields = {};

  if (typeof data.role !== 'undefined') {
    allowedFields.role = data.role;
  }

  if (typeof data.is_active !== 'undefined') {
    allowedFields.is_active = data.is_active;
  }

  await user.update(allowedFields);

  const safeUser = user.toJSON();
  delete safeUser.password_hash;

  return safeUser;
};

// DELETE USER

export const deleteUserService = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw {
      statusCode: 404,
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    };
  }

  await user.destroy();

  return true;
};
