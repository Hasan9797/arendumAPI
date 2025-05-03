import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-access-key';

export const generateAccessToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const generateRefreshToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const blockUserAccessToken = async (userId, expiresAt = 3600) => {
  const key = `blocked_user_:${userId}`;
  await redisClient.set(key, token, { EX: expiresAt }); // 1 hour in 3600 seconds
};

export const getBlockedAccessToken = async (userId) => {
  const key = `blocked_user_:${userId}`;
  return await redisClient.get(key); // Blocked token or null
};
