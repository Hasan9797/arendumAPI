import prisma from '../config/prisma.js';

export const getMachines = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    const where = {};

    filters.forEach((filter) => {
      const { column, operator, value } = filter;

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

    const machines = await prisma.machines.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.machines.count({ where });

    const data = machines.map((machine) => {
      const { nameRu, nameUz, nameEn, ...rest } = machine;
      rest.name = lang == 'uz' ? nameUz : nameRu;
      return rest;
    });

    return {
      data,
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

const getMachineById = async (lang, id) => {
  const machine = await prisma.machines.findUnique({
    where: { id },
  });

  const adjustName = (obj) => {
    const { nameRu, nameUz, nameEn, ...relationRest } = obj;
    return {
      ...relationRest,
      name: lang === 'ru' ? nameRu : nameUz,
    };
  };

  return adjustName(machine);
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

const getMachinesIdAnName = async () => {
  return await prisma.machines.findMany({
    select: {
      id: true,
      title: true,
    },
  });
};

export default {
  getMachines,
  getMachineById,
  createMachine,
  updateMachineById,
  deleteMachineById,
  getMachinesIdAnName,
};
