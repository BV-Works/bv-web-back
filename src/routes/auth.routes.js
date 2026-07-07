import { Router } from 'express';

import {
  login,
  logout,
  checkMe,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/auth.controller.js';

import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import {
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from '../validators/auth.validator.js';

const router = Router();

// PUBLIC AUTH

// POST /auth/login
router.post('/login', loginValidator, validateRequest, login);

// POST /auth/logout
router.post('/logout', logout);

// POST /auth/forgot-password: NO devolver nunca: si el email existe o no, para evitar ataques de enumeración de usuarios.
//-> recibe un email, si existe el usuario, genera un token de recuperación y lo envía por email
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validateRequest,
  forgotPassword,
);

// POST /auth/reset-password
router.post(
  '/reset-password',
  resetPasswordValidator,
  validateRequest,
  resetPassword,
); //-> recibe un token y una nueva contraseña, verifica el token, si es válido, actualiza la contraseña del usuario y elimina el token
// TODO:
// Password reset JWTs are currently reusable until expiration.
// Future improvement:
// invalidate after first successful use
// (password_changed_at or password_reset_version).

// PROTECTED AUTH (requieren token válido, pero no rol específico)

// GET /auth/me
router.get('/me', authenticateJWT, checkMe); //-> devuelve los datos del usuario logueado (sin password) o null si no hay sesión activa

// PUT  /auth/change-password
router.put(
  '/change-password',
  authenticateJWT,
  changePasswordValidator,
  validateRequest,
  changePassword,
); //-> recibe la contraseña actual y la nueva contraseña, verifica que la contraseña actual sea correcta, si es así, actualiza la contraseña del usuario

export default router;
