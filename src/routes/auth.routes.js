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

const router = Router();

// PUBLIC AUTH

// POST /auth/login
router.post('/login', login);

// POST /auth/logout
router.post('/logout', logout);

// POST /auth/forgot-password: NO devolver nunca: si el email existe o no, para evitar ataques de enumeración de usuarios.
//-> recibe un email, si existe el usuario, genera un token de recuperación y lo envía por email (simulado) 
// (hay que completar Resend para enviar correos por email, por ahora se simula mostrando el link de reset en consola)
router.post('/forgot-password', forgotPassword); 

// POST /auth/reset-password
router.post('/reset-password', resetPassword); //-> recibe un token y una nueva contraseña, verifica el token, si es válido, actualiza la contraseña del usuario y elimina el token



// PROTECTED AUTH (requieren token válido, pero no rol específico)

// GET /auth/me
router.get('/me', authenticateJWT, checkMe); //-> devuelve los datos del usuario logueado (sin password) o null si no hay sesión activa

// PUT  /auth/change-password
router.put('/change-password', authenticateJWT, changePassword); //-> recibe la contraseña actual y la nueva contraseña, verifica que la contraseña actual sea correcta, si es así, actualiza la contraseña del usuario

export default router;
