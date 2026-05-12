import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

// LOGIN
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials', code: 'INVALID_LOGIN' };
  }

  if (!user.is_active) {
    throw { statusCode: 403, message: 'User inactive', code: 'USER_INACTIVE' };
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid credentials', code: 'INVALID_LOGIN' };
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: '7d' },
  );

  return { user, token };
};

// VERIFY TOKEN

export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};