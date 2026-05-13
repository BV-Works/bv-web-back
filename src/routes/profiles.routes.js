import { Router } from 'express';

import {
  getProfiles,
  getProfileById,
  getProfileBySlug,
  getMyProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getLinksByProfile,
  createLink,
  updateLink,
  deleteLink,
} from '../controllers/profiles.controller.js';

import { authenticateJWT } from '../middlewares/auth.middleware.js';

import { authorizeRoles } from '../middlewares/role.middleware.js';

import {
  checkProfileOwnership,
  checkLinkOwnership,
} from '../middlewares/ownership.middleware.js';

import { validateRequest } from '../middlewares/validation.middleware.js';

import {
  profileIdValidator,
  profileSlugValidator,
  getProfilesValidator,
  createProfileValidator,
  updateProfileValidator,
  linkIdValidator,
  createLinkValidator,
  updateLinkValidator,
} from '../validators/profiles.validator.js';

import { ROLES } from '../constants/roles.js';

const router = Router();

// PROFILES

// RUTAS PUBLICAS (sin autenticación)

// GET /profiles
// filtros:
// ?type=TEAM | ARTIST
// ?is_public=true
// ?limit=10&page=1
router.get('/', getProfilesValidator, validateRequest, getProfiles);

// GET PROFILE PÚBLICO (landing pages)
router.get(
  '/public/:slug',
  profileSlugValidator,
  validateRequest,
  getProfileBySlug,
);

// RUTAS PROTEGIDAS (requieren autenticación)

// GET perfil del usuario autenticado
router.get('/me', authenticateJWT, getMyProfile);

// RUTAS ADMIN O PRIVADAS (requieren rol ADMIN o ownership del perfil)

// GET admin / edición por ID (ADMIN ONLY)
router.get(
  '/:id',
  authenticateJWT,
  authorizeRoles(ROLES.ADMIN),
  profileIdValidator,
  validateRequest,
  getProfileById,
);

// POST /profiles (ADMIN solo para crear perfiles de otros usuarios)
// (el usuario común solo puede crear su propio perfil al registrarse, lo cual se manejará en el auth.controller.js (DE MOMENTO SOLO ADMIN))
router.post(
  '/',
  authenticateJWT,
  authorizeRoles(ROLES.ADMIN),
  createProfileValidator,
  validateRequest,
  createProfile,
);

// PUT /profiles/:id (ADMIN o propietario)
router.put(
  '/:id',
  authenticateJWT,
  profileIdValidator,
  validateRequest, // Validar ID antes de verificar ownership
  checkProfileOwnership,
  updateProfileValidator,
  validateRequest, // Validar body después de verificar ownership
  updateProfile,
);

// DELETE /profiles/:id (ADMIN o propietario)
router.delete(
  '/:id',
  authenticateJWT,
  profileIdValidator,
  validateRequest,
  checkProfileOwnership,
  deleteProfile,
);

// LINKS (subrecurso de profile)

// GET links de un profile
router.get(
  '/:id/links',
  authenticateJWT,
  validateRequest,
  checkProfileOwnership,
  getLinksByProfile,
);

// POST link
router.post(
  '/:id/links',
  authenticateJWT,
  createLinkValidator,
  validateRequest,
  checkProfileOwnership,
  createLink,
);

// PUT link
router.put(
  '/:id/links/:linkId',
  authenticateJWT,
  linkIdValidator,
  updateLinkValidator,
  validateRequest,
  checkLinkOwnership,
  updateLink,
);

// DELETE link
router.delete(
  '/:id/links/:linkId',
  authenticateJWT,
  linkIdValidator,
  validateRequest,
  checkLinkOwnership,
  deleteLink,
);

export default router;
