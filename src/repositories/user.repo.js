import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/whereFilterHelper.js';

const getUsers = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters);

    const orderBy = { [sort.column]: sort.value };

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
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
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
