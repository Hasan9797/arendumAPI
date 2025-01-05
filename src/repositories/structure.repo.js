import prisma from '../config/prisma.js';

export const getAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    const where = {};

    filters.forEach((filter) => {
      const { column, operator, value } = filter;

      if (operator === 'between' && column === 'created_at') {
        const [startDate, endDate] = value.split('_');
        where[column] = {
          gte: startDate,
          lte: endDate,
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

    const categories = await prisma.structure.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.structure.count({ where });

    return {
      data: categories,
      pagination: {
        totalUsers: total,
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

const getById = async (id) => {
  return await prisma.structure.findUnique({
    where: { id },
  });
};

const create = async (newUser) => {
  return await prisma.structure.create({
    data: newUser,
  });
};

const updateById = async (id, machineData) => {
  try {
    const updatedUser = await prisma.structure.update({
      where: { id },
      data: machineData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

const deleteById = async (id) => {
  try {
    return await prisma.structure.delete({
      where: { id },
    });
  } catch (error) {
    throw error.message;
  }
};

const getIds = async () => {
  try {
    return await prisma.structure.findMany({
      select: { id: true, name: true },
    });
  } catch (error) {
    throw error.message;
  }
};

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getIds,
};
