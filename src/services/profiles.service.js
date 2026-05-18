import Profile from '../models/Profile.js';
import Link from '../models/Link.js';
import { generateUniqueSlug } from '../utils/slug.js';

// GET PROFILES (LIST + FILTERS) - PUBLIC

export const getProfilesService = async (filters) => {
  const { type, is_public, limit = 10, page = 1 } = filters;

  const where = {};

  if (type) {
    where.profile_type = type;
  }

  if (is_public !== undefined) {
    where.is_public = is_public === true || is_public === 'true';
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await Profile.findAndCountAll({
    where,
    limit,
    offset,
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

// GET PROFILE BY ID - ADMIN ONLY

export const getProfileByIdService = async (id) => {
  const profile = await Profile.findByPk(id);

  if (!profile) {
    throw {
      statusCode: 404,
      message: 'Profile not found',
      code: 'PROFILE_NOT_FOUND',
    };
  }

  return profile;
};

// GET PROFILE BY userId - ADMIN ONLY

export const getProfileByUserIdService = async (userId) => {
  const profile = await Profile.findOne({
    where: { user_id: userId },
    include: [
      {
        model: Link,
        as: 'links',
      },
    ],
  });

  if (!profile) {
    throw {
      statusCode: 404,
      message: 'Profile not found',
      code: 'PROFILE_NOT_FOUND',
    };
  }

  return profile;
};

// GET PROFILE BY SLUG - PUBLIC

export const getProfileBySlugService = async (slug) => {
  const profile = await Profile.findOne({
    where: { slug, is_public: true },
    include: [
      {
        model: Link,
        as: 'links',
        where: { is_visible: true },
        required: false,
      },
    ],
  });

  if (!profile) {
    throw {
      statusCode: 404,
      message: 'Profile not found',
      code: 'PROFILE_NOT_FOUND',
    };
  }

  return profile;
};

// GET MY PROFILE - USUARIO AUTENTICADO

export const getMyProfileService = async (userId) => {
  const profile = await Profile.findOne({
    where: { user_id: userId },
    include: [
      {
        model: Link,
        as: 'links',
      },
    ],
  });

  return profile;
};

// CREATE PROFILE - ADMIN ONLY

export const createProfileService = async (data) => {
  const slug = await generateUniqueSlug(data.display_name);

  const profile = await Profile.create({
    ...data,
    slug,
  });

  return profile;
};

// UPDATE PROFILE - ADMIN O OWNER CONTROLADO POR MIDDLEWARE

export const updateProfileService = async (profile, data) => {
  if (data.slug) {
    const existing = await Profile.findOne({
      where: { slug: data.slug },
    });

    if (existing && existing.id !== profile.id) {
      throw {
        statusCode: 409,
        message: 'Slug already in use',
        code: 'SLUG_CONFLICT',
      };
    }
  }
  await profile.update(data);
  return profile;
};

// DELETE PROFILE - ADMIN O OWNER CONTROLADO POR MIDDLEWARE

export const deleteProfileService = async (profile) => {
  await profile.destroy();
  return true;
};

// LINKS - ADMIN O OWNER CONTROLADO POR MIDDLEWARE

// GET LINKS BY PROFILE
export const getLinksByProfileService = async (profileId) => {
  return await Link.findAll({
    where: { profile_id: profileId },
    order: [['position', 'ASC']],
  });
};

// CREATE LINK
export const createLinkService = async (profileId, data) => {
  return await Link.create({
    ...data,
    profile_id: profileId,
  });
};

// UPDATE LINK
export const updateLinkService = async (link, data) => {
  await link.update(data);
  return link;
};

// DELETE LINK
export const deleteLinkService = async (link) => {
  await link.destroy();
  return true;
};
