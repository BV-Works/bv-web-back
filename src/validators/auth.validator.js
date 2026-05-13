import { body } from 'express-validator';

// --------------------------------------
// LOGIN
// POST /auth/login
// --------------------------------------

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// --------------------------------------
// FORGOT PASSWORD
// POST /auth/forgot-password
// --------------------------------------

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
];

// --------------------------------------
// RESET PASSWORD
// POST /auth/reset-password
// --------------------------------------

export const resetPasswordValidator = [
  body('token').trim().notEmpty().withMessage('Token is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isString()
    .withMessage('New password must be a string')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

// --------------------------------------
// CHANGE PASSWORD
// PUT /auth/change-password
// --------------------------------------

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isString()
    .withMessage('Current password must be a string'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isString()
    .withMessage('New password must be a string')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];
