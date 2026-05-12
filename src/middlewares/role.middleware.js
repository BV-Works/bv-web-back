import { errorResponse } from '../utils/apiResponse.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json(errorResponse('Unauthorized', 'NO_USER'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json(errorResponse('Forbidden', 'FORBIDDEN_ROLE'));
    }

    return next();
  };
};