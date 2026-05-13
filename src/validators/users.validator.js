import { body, param, query } from 'express-validator';

// --------------------------------------
// PARAMS
// --------------------------------------

export const userIdValidator = [
  param('id').isUUID().withMessage('Invalid user id'),
];

// --------------------------------------
// QUERY (GET /users)
// --------------------------------------

export const getUsersValidator = [
  query('role')
    .optional()
    .isIn(['ADMIN', 'TEAM', 'CUSTOMER', 'ARTIST'])
    .withMessage('Invalid role'),

  query('is_active')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('is_active must be boolean'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 and 50'),

  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
];

// --------------------------------------
// CREATE USER
// --------------------------------------

export const createUserValidator = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .trim()
    .normalizeEmail()
    .withMessage('Invalid email'),

  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['ADMIN', 'TEAM', 'CUSTOMER', 'ARTIST'])
    .withMessage('Invalid role'),

  body('is_active')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('is_active must be boolean'),
];

// --------------------------------------
// UPDATE USER
// --------------------------------------

export const updateUserValidator = [
  body('role')
    .optional()
    .isIn(['ADMIN', 'TEAM', 'CUSTOMER', 'ARTIST'])
    .withMessage('Invalid role'),

  body('is_active')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('is_active must be boolean'),
];
