import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-access-key';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'secret-refresh-key';

export const generateAccessToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const generateRefreshToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};