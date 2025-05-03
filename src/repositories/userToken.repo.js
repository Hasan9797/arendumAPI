import prisma from '../config/prisma.js';
import { blockUserAccessToken } from '../helpers/jwtTokenHelper.js';

export const updateOrCreateUserToken = async (body) => {
  try {
    const currentUserToken = await prisma.userToken.findFirst({
      where: {
        userId: parseInt(body.userId),
      },
    });

    if (currentUserToken) {
      await updateUserToken(body.userId, body.token);
    } else {
      await createUserToken(body);
    }
  } catch (error) {
    throw error;
  }
};

export const createUserToken = async (body) => {
  try {
    await prisma.userToken.create({
      data: {
        userId: parseInt(body.userId),
        token: body.token,
        expire: body.expire
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateUserToken = async (userId, token, isBlock = false) => {
  try {
    if (isBlock) {
      await blockUserAccessToken(userId);
    }

    await prisma.userToken.update({
      where: { userId: parseInt(userId) },
      data: { token },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUserTokenByUserId = async (userId) => {
  try {
    const currentUserToken = await prisma.userToken.findFirst({
      where: {
        userId: parseInt(userId),
      },
    });

    if (currentUserToken) {
      await prisma.userToken.delete({
        where: {
          userId: parseInt(userId),
        },
      });
      await blockUserAccessToken(userId);
    }
  } catch (error) {
    throw error;
  }
};

export const getUserTokenByUserId = async (userId) => {
  try {
    const result = await prisma.userToken.findFirst({
      where: {
        userId: parseInt(userId),
      },
      select: {
        token: true,
      },
    });

    return result?.token || null; // faqat token string qaytadi
  } catch (error) {
    throw error;
  }
};
