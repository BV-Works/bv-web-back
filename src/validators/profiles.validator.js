import { body, param, query } from 'express-validator';

// --------------------------------------
// PARAMS
// --------------------------------------

export const profileIdValidator = [
  param('id').isUUID().withMessage('Invalid profile id'),
];

export const profileSlugValidator = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .isSlug()
    .withMessage('Invalid slug'),
];

export const linkIdValidator = [
  param('linkId').isUUID().withMessage('Link ID must be a valid UUID'),
];

// --------------------------------------
// QUERY (GET /profiles)
// --------------------------------------

export const getProfilesValidator = [
  query('type')
    .optional()
    .isIn(['TEAM', 'ARTIST'])
    .withMessage('Invalid profile type'),

  query('is_public')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('is_public must be boolean'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),

  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
];

// --------------------------------------
// CREATE PROFILE
// POST /profiles
// --------------------------------------

export const createProfileValidator = [
  body('display_name')
    .trim()
    .notEmpty()
    .withMessage('display_name is required')
    .isLength({ min: 2, max: 120 })
    .withMessage('display_name must be 2-120 chars'),

  body('slug')
    .trim()
    .notEmpty()
    .withMessage('slug is required')
    .isSlug()
    .withMessage('slug must be valid'),

  body('profile_type')
    .notEmpty()
    .withMessage('profile_type is required')
    .isIn(['TEAM', 'ARTIST'])
    .withMessage('profile_type must be TEAM or ARTIST'),

  body('bio').optional().isString().withMessage('bio must be string'),

  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('avatar_url must be valid URL'),

  body('secondary_image_url')
    .optional()
    .isURL()
    .withMessage('secondary_image_url must be valid URL'),

  body('is_public')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('is_public must be boolean'),

  body('position').optional().isInt().withMessage('position must be integer'),
];

// --------------------------------------
// UPDATE PROFILE
// PUT /profiles/:id
// --------------------------------------

export const updateProfileValidator = [
  body('display_name').optional().isLength({ min: 2, max: 120 }),

  body('slug').optional().isSlug(),

  body('bio').optional().isString(),

  body('avatar_url').optional().isURL(),

  body('secondary_image_url').optional().isURL(),

  body('is_public').optional().isBoolean().toBoolean(),

  body('position').optional().isInt(),
];

// --------------------------------------
// CREATE LINK
// --------------------------------------

export const createLinkValidator = [
  body('platform')
    .notEmpty()
    .withMessage('Platform is required')
    .isIn([
      'spotify',
      'instagram',
      'youtube',
      'tiktok',
      'applemusic',
      'twitch',
      'custom',
    ])
    .withMessage('Invalid platform'),

  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .isLength({ min: 1, max: 120 })
    .withMessage('Title must be between 1 and 120 characters'),

  body('url')
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('URL must be valid'),

  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a positive integer'),
];

// --------------------------------------
// UPDATE LINK
// --------------------------------------

export const updateLinkValidator = [
  body('platform')
    .optional()
    .isIn([
      'spotify',
      'instagram',
      'youtube',
      'tiktok',
      'applemusic',
      'twitch',
      'custom',
    ])
    .withMessage('Invalid platform'),

  body('title')
    .optional()
    .isString()
    .isLength({ min: 1, max: 120 })
    .withMessage('Title must be between 1 and 120 characters'),

  body('url').optional().isURL().withMessage('URL must be valid'),

  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a positive integer'),

  body('is_visible')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('is_visible must be boolean'),
];

// --------------------------------------
// QUERY VALIDATION (future filtering)
// --------------------------------------

export const getLinksValidator = [
  query('visible').optional().isBoolean().toBoolean(),
];
