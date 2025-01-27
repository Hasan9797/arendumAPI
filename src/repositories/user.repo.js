import prisma from '../config/prisma.js';

export const getUsers = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    const where = {};

    filters.forEach((filter) => {
      const { column, operator, value } = filter;

      if (operator === 'between' && column === 'createdAt') {
        const [startDate, endDate] = value.split('_');

        if (!startDate || !endDate) {
          return;
        }

        const startUnixTimestamp = Math.floor(Date.parse(startDate) / 1000);
        const endUnixTimestamp = Math.floor(Date.parse(endDate) / 1000);

        where[column] = {
          gte: startUnixTimestamp,
          lte: endUnixTimestamp,
        };
      } else {
        if (operator === 'contains') {
          where[column] = { contains: value, mode: 'insensitive' };
        } else if (operator === 'equals') {
          where[column] = value;
        }
      }
    });

    const orderBy = sort?.column
      ? { [sort.column]: sort.value }
      : { id: 'desc' };

    const users = await prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.user.count({ where });

    return {
      data: users,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: limit,
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

const createUser = async (newUser) => {
  return await prisma.user.create({
    data: newUser,
  });
};

const getUser = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

const deleteUserById = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};

const updateUserById = async (id, userData) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export default {
  getUsers,
  createUser,
  getUser,
  deleteUserById,
  updateUserById,
};
