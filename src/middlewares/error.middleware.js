import { errorResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error('🔥 ERROR:', err);

  const statusCode = err.statusCode || 500;

  return res
    .status(statusCode)
    .json(
      errorResponse(
        err.message || 'Internal server error',
        err.code || 'INTERNAL_ERROR',
      ),
    );
};

export const notFound = (req, res) => {
  res.status(404).json(errorResponse('Route not found', 'NOT_FOUND'));
};
