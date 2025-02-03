import prisma from '../config/prisma.js';

export const getMachinesPriceParams = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    let where = {};

    filters.forEach((filter) => {
      let { column, operator, value } = filter;

      if (operator === 'between' && column === 'createdAt') {
        const [startDate, endDate] = value.split('_');

        where[column] = {
          gte: new Date(startDate),
          lte: new Date(endDate),
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

    const machinePriceParams = await prisma.machinePriceParams.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.machinePriceParams.count({ where });

    return {
      data: machinePriceParams,
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

const getMachinePriceParamsById = async (id) => {
  return await prisma.machinePriceParams.findUnique({
    where: { id },
  });
};

const createMachinePriceParams = async (newUser) => {
  return await prisma.machinePriceParams.create({
    data: newUser,
  });
};

const updateMachinePriceParamsById = async (id, machineData) => {
  try {
    const updatedUser = await prisma.machinePriceParams.update({
      where: { id },
      data: machineData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

const deleteMachinePriceParamsById = async (id) => {
  try {
    return await prisma.machinePriceParams.delete({
      where: { id },
    });
  } catch (error) {
    throw error.message;
  }
};

export default {
  getMachinesPriceParams,
  getMachinePriceParamsById,
  createMachinePriceParams,
  updateMachinePriceParamsById,
  deleteMachinePriceParamsById,
};
