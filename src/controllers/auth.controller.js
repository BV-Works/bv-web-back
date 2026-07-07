import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { env } from '../config/env.js';

import { successResponse, errorResponse } from '../utils/apiResponse.js';
import {
  loginUser,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  resetUserPassword,
} from '../services/auth.service.js';

import { sendResetPasswordEmail } from '../services/mail.service.js';
import { AUTH_COOKIE_NAME } from '../constants/auth.constants.js';

// LOGIN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json(
      successResponse(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        'Login successful',
      ),
    );
  } catch (err) {
    next(err);
  }
};

// LOGOUT

export const logout = async (_req, res) => {
  try {
    res.clearCookie(AUTH_COOKIE_NAME);

    return res.json(successResponse(null, 'Logged out'));
  } catch (err) {
    next(err);
  }
};

// ME (usuario autenticado)

export const checkMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.json(successResponse(null)); // no error, simplemente no hay usuario autenticado, el FE decide qué hacer con esto cuando recibe null
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.json(successResponse(null)); // no error, si el token es válido pero el usuario ya no existe, devolvemos null, el FE decide qué hacer con esto (ej: forzar logout)
    }

    return res.json(successResponse(user));
  } catch {
    return res.json(successResponse(null)); // no error, si hay cualquier error (ej: token mal formado), simplemente devolvemos null, el FE decide qué hacer con esto
  }
};

// FORGOT PASSWORD (NO enviar emails todavía primero vamos a hacer el flujo basico de BE y cuando tengamos alguna pantalla en FE probamos con RESEND)

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (user) {
    const token = generatePasswordResetToken(user);

    const resetUrl = `${env.frontendUrl}/reset-password?token=${token}`;

    await sendResetPasswordEmail({
      to: user.email,
      resetUrl,
    });
  }

  return res.json(
    successResponse(
      null,
      'If the account exists, a reset email has been sent.',
    ),
  );
};

// RESET PASSWORD (NO enviar emails todavía primero vamos a hacer el flujo basico de BE y cuando tengamos alguna pantalla en FE probamos con RESEND)

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const payload = verifyPasswordResetToken(token);

  await resetUserPassword({
    userId: payload.id,
    newPassword: newPassword,
  });

  return res.json(successResponse(null, 'Password reset successful'));
};

// CHANGE PASSWORD (requiere auth middleware)

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;

    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json(errorResponse('User not found', 'USER_NOT_FOUND'));
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json(
          errorResponse(
            'New password must be different from the current password',
            'PASSWORD_UNCHANGED',
          ),
        );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json(errorResponse('Invalid password', 'INVALID_PASSWORD'));
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await user.update({ password_hash: hashed });

    return res.json(successResponse(null, 'Password updated'));
  } catch (err) {
    next(err);
  }
};
