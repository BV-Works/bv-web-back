import { Router } from 'express';

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js';

import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

import { validateRequest } from '../middlewares/validation.middleware.js';

import {
  userIdValidator,
  getUsersValidator,
  createUserValidator,
  updateUserValidator,
} from '../validators/users.validator.js';

import { ROLES } from '../constants/roles.js';

const router = Router();

// GET /users
router.get(
  '/',
  authenticateJWT,
  authorizeRoles(ROLES.ADMIN),
  getUsersValidator,
  validateRequest,
  getUsers,
);

// GET /users/:id
router.get(
  '/:id',
  authenticateJWT,
  authorizeRoles(ROLES.ADMIN),
  userIdValidator,
  validateRequest,
  getUserById,
);

// POST /users CREATE USER

router.post(
  '/',
  authenticateJWT,
  authorizeRoles(ROLES.ADMIN),
  createUserValidator,
  validateRequest,
  createUser,
);

// PUT /users/:id
router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles(ROLES.ADMIN),
  userIdValidator,
  updateUserValidator,
  validateRequest,
  updateUser,
);

// DELETE /users/:id
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles(ROLES.ADMIN),
  userIdValidator,
  validateRequest,
  deleteUser,
);

export default router;
