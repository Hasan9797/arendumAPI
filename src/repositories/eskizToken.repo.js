import prisma from '../config/prisma.js';
import redisClient from '../config/redis.js';

Math.floor(Date.now() / 1000);

export const getEskizToken = async () => {
  try {
    const cacheKey = `eskizToken`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const token = await prisma.eskizToken.findFirst();

    await redisClient.setEx(cacheKey, 86400, JSON.stringify(token)); // 86400 sekund = 24 soat

    return token;
  } catch (error) {
    throw error;
  }
};

export const createEskizToken = async (token) => {
  try {
    return await prisma.eskizToken.create({
      data: token,
    });
  } catch (error) {
    throw error;
  }
};

export const updateEskizToken = async (id, newData) => {
  try {
    const cacheKey = `eskizToken`;
    await redisClient.del(cacheKey);

    return await prisma.eskizToken.update({
      where: { id },
      data: newData,
    });
  } catch (error) {
    throw error;
  }
};
