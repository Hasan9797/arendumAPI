import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import redisClient from './src/config/redis.js';
dotenv.config();

 const cacheKey = `eskizToken`;
    await redisClient.del(cacheKey);
