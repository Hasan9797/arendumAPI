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

    const categories = await prisma.machineParams.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.machineParams.count({ where });

    return {
      data: categories,
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
  return await prisma.machineParams.findUnique({
    where: { id },
  });
};

const create = async (newUser) => {
  return await prisma.machineParams.create({
    data: newUser,
  });
};

const updateById = async (id, machineParamsData) => {
  try {
    const updatedUser = await prisma.machineParams.update({
      where: { id },
      data: machineParamsData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

const getSelectList = async (machineId) => {
  const params = await prisma.machineParams.findMany({
    where: {
      machineId,
    },
    select: {
      nameEn: true,
      params: true,
    },
  });

  const result = params.reduce((acc, { nameEn, params }) => {
    const parsedParams = params ? params : [];
    acc[nameEn ?? 'unknown'] = Array.isArray(parsedParams)
      ? parsedParams.map((param) => param.name)
      : [];
    return acc;
  }, {});

  return result;
};

const distroy = async (id) => {
  return await prisma.machineParams.delete({
    where: { id },
  });
};

export default {
  getAll,
  create,
  getById,
  distroy,
  updateById,
  getSelectList,
};
