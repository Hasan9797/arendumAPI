import prisma from '../config/prisma.js';

export const getMachinesPrice = async (query) => {
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

    const machinePrices = await prisma.machinePrice.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        machines: true,
      },
    });

    const total = await prisma.machinePrice.count({ where });

    return {
      data: machinePrices,
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

const createMachinePrice = async (newUser) => {
  return await prisma.machinePrice.create({
    data: newUser,
  });
};

const getMachinePriceById = async (id) => {
  return await prisma.machinePrice.findUnique({
    where: { id },
  });
};

const updateMachinePriceById = async (id, machineData) => {
  try {
    const updatedUser = await prisma.machinePrice.update({
      where: { id },
      data: machineData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

const deleteMachinePriceById = async (id) => {
  try {
    return await prisma.machinePrice.delete({
      where: { id },
    });
  } catch (error) {
    throw error.message;
  }
};

export default {
  getMachinesPrice,
  getMachinePriceById,
  createMachinePrice,
  updateMachinePriceById,
  deleteMachinePriceById,
};
