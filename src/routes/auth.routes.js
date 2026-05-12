import { Router } from 'express';

import {
  login,
  logout,
  checkMe,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/auth.controller';

const router = Router();

// POST /auth/login
router.post('/login', login);
// POST /auth/logout
router.post('/logout', logout);

// GET /auth/me
router.get('/me', checkMe); //-> devuelve los datos del usuario logueado (sin password) o null si no hay sesión activa

// POST /auth/forgot-password: NO devolver nunca: si el email existe o no, para evitar ataques de enumeración de usuarios.
router.post('/forgot-password', forgotPassword); //-> recibe un email, si existe el usuario, genera un token de recuperación y lo envía por email (simulado)

// POST /auth/reset-password
router.post('/reset-password', resetPassword); //-> recibe un token y una nueva contraseña, verifica el token, si es válido, actualiza la contraseña del usuario y elimina el token

// PUT  /auth/change-password: Necesitará middleware auth.
router.put('/change-password', changePassword); //-> recibe la contraseña actual y la nueva contraseña, verifica que la contraseña actual sea correcta, si es así, actualiza la contraseña del usuario

export default router;
