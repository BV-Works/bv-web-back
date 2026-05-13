import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        errorResponse('Validation failed', 'VALIDATION_ERROR', errors.array()),
      );
  }

  return next();
};
