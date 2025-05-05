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
      await updateUserToken(body);
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
      data: body,
    });
  } catch (error) {
    throw error;
  }
};

export const updateUserToken = async (body) => {
  try {
    await prisma.userToken.update({
      where: { userId: parseInt(body.userId) },
      data: {
        accessToken: body?.accessToken,
        refreshToken: body?.refreshToken,
      },
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
      await blockUserAccessToken(currentUserToken.accessToken);
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
        accessToken: true,
        refreshToken: true,
      },
    });

    return result; // faqat token string qaytadi
  } catch (error) {
    throw error;
  }
};
