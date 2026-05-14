import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AUTH_COOKIE_NAME } from '../constants/auth.constants.js';
import { errorResponse } from '../utils/apiResponse.js';

// AUTH REQUIRED (hard protection)

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json(errorResponse('Unauthorized', 'NO_TOKEN'));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    req.user ={
      id: decoded.id,
      role: decoded.role,
    };
    return next();
  } catch (err) {
    return res
      .status(401)
      .json(errorResponse('Invalid or expired token', 'INVALID_TOKEN'));
  }
};
