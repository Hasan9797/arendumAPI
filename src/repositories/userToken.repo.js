import prisma from '../config/prisma.js';

export const updateOrCreateUserToken = async (userToken) => {
  try {
    const currentUserToken = await prisma.userToken.findFirst({
      where: {
        userId: parseInt(userToken.userId),
      },
    });

    if (currentUserToken) {
      await prisma.userToken.update({
        where: {
          id: currentUserToken.id,
        },
        data: {
          token: userToken.token,
        },
      });
    } else {
      await prisma.userToken.create({
        data: userToken,
      });
    }
  } catch (error) {
    throw error;
  }
};
