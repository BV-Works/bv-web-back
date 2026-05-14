import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { env } from '../config/env.js';

import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { loginUser } from '../services/auth.service.js';
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

  // generar token fake o real // TODO: replace with secure token + DB persistence + expiry
  const resetToken = 'dummy-token';

  console.log('RESET LINK:', `https://app/reset/${resetToken}`);

  return res.json(successResponse(null, 'If user exists, reset email sent'));
};

// RESET PASSWORD (NO enviar emails todavía primero vamos a hacer el flujo basico de BE y cuando tengamos alguna pantalla en FE probamos con RESEND)

export const resetPassword = async (_req, res) => {
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
