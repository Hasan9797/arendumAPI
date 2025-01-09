import prisma from '../config/prisma.js';
import UserRole from '../constants/user-role.constant.js';

export const getMachines = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    const where = { role: UserRole.MERCHANT };

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

    const categories = await prisma.machines.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.machines.count({ where });

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

const createMachine = async (newUser) => {
  return await prisma.machines.create({
    data: newUser,
  });
};

const getMachineById = async (id) => {
  return await prisma.machines.findUnique({
    where: { id },
  });
};

const deleteMachineById = async (id) => {
  try {
    return await prisma.machines.delete({
      where: { id },
    });
  } catch (error) {
    throw error.message;
  }
};

const updateMachineById = async (id, machineData) => {
  try {
    const updatedUser = await prisma.machines.update({
      where: { id },
      data: machineData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export default {
  getMachines,
  getMachineById,
  createMachine,
  updateMachineById,
  deleteMachineById,
};
