import prisma from '../config/prisma.js';

export const getAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    const where = {};

    filters.forEach((filter) => {
      const { column, operator, value } = filter;

      if (operator === 'between' && column === 'createdAt') {
        const [startDate, endDate] = value.split('_');

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

    const paramsFilter = await prisma.machineParamsFilters.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.machineParamsFilters.count({ where });

    return {
      data: paramsFilter,
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

const getById = async (id) => {
  return await prisma.machineParamsFilters.findUnique({
    where: { id },
  });
};

const getParamsFilterByMachineId = async (machineId) => {
  try {
    return await prisma.machineParamsFilters.findFirst({
      where: { machineId },
    });
  } catch (error) {
    throw error;
  }
};

const create = async (newUser) => {
  return await prisma.machineParamsFilters.create({
    data: newUser,
  });
};

const distroy = async (id) => {
  try {
    const deletedRow = await prisma.machineParamsFilters.delete({
      where: { id },
    });

    return deletedRow;
  } catch (error) {
    if (error.code === 'P2025') {
      return false;
    } else {
      throw error; // Boshqa xatolarni qayta ko'taramiz
    }
  }
};

const updateById = async (id, paramsFilterData) => {
  try {
    const updatedUser = await prisma.machineParamsFilters.update({
      where: { id },
      data: paramsFilterData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export default {
  getAll,
  getById,
  getParamsFilterByMachineId,
  create,
  distroy,
  updateById,
};
