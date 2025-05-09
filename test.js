import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import redisClient from './src/config/redis.js';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-access-key';
function errorThrow() {
  const error = new Error('Test Error');
  error.code = 400;
  throw error;
}

function getError() {
  try {
    errorThrow();
  } catch (error) {
    console.log(error.message, error.code);
  }
}

 const cacheKey = `eskizToken`;
    await redisClient.del(cacheKey);

// getError();

