import prisma from '../config/prisma.js';

export const getAll = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    const where = {};

    filters.forEach((filter) => {
      const { column, operator, value } = filter;

      if (column === 'name' && (lang === 'uz' || lang === 'ru')) {
        column += lang.toUpperCase();
      }

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

    const allMachines = await prisma.machineParams.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        machines: {
          select: {
            nameRu: true,
            nameUz: true,
            nameEn: true,
            status: true,
            img: true,
          },
        },
      },
    });

    const total = await prisma.machineParams.count({ where });

    const sanitizedMachines = allMachines.map(
      ({ nameUz, nameRu, machineId, ...rest }) => ({
        ...rest,
        name: lang === 'ru' ? nameRu : nameUz,
      })
    );

    const data = sanitizedMachines.map(
      ({ createdAt, updatedAt, machines, ...rest }) => {
        const adjustName = (obj) => {
          const { nameRu, nameUz, nameEn, ...relationRest } = obj;
          return {
            ...relationRest,
            name: lang === 'ru' ? nameRu : nameUz,
          };
        };

        return {
          ...rest,
          machine: machines ? adjustName(machines) : null,
          createdAt,
          updatedAt,
        };
      }
    );

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
    throw error;
  }
};

const getById = async (lang, id) => {
  try {
    const machine = await prisma.machineParams.findUnique({
      where: { id },
      include: {
        machines: {
          select: {
            nameRu: true,
            nameUz: true,
            status: true,
            img: true,
          },
        },
      },
    });

    const adjustName = (obj) => {
      const { nameRu, nameUz, nameEn, machineId, machines, ...rest } = obj;

      const machine = {
        ...machines,
        name: lang === 'ru' ? machines.nameRu : machines.nameUz,
      };

      delete machine.nameRu;
      delete machine.nameUz;

      return {
        ...rest,
        name: lang === 'ru' ? nameRu : nameUz,
        machine,
      };
    };

    return adjustName(machine);
  } catch (error) {
    throw error;
  }
};

const getByMachineId = async (lang, machineId) => {
  try {
    const params = await prisma.machineParams.findMany({
      where: { machineId },
    });

    const adjustName = (obj) => {
      const { nameRu, nameUz, ...relationRest } = obj;
      return {
        ...relationRest,
        name: lang === 'ru' ? nameRu : nameUz,
      };
    };

    const result = params.map((param) => adjustName(param));

    return result;
  } catch (error) {
    console.error('Error fetching machine params:', error);
    throw error;
  }
};

const create = async (newUser) => {
  try {
    return await prisma.machineParams.create({
      data: newUser,
    });
  } catch (error) {
    throw error;
  }
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
  return await prisma.machineParams.findMany({
    where: {
      machineId,
    },
    select: {
      nameEn: true,
      params: true,
    },
  });
};

const distroy = async (id) => {
  return await prisma.machineParams.delete({
    where: { id },
  });
};

const getParamsOption = async (machineId = 0) => {
  try {
    return await prisma.machineParams.findMany({
      where: {
        machineId,
      },
      select: {
        nameUz: true,
        nameRu: true,
        nameEn: true,
        params: true,
      },
    });
  } catch (error) {
    console.error('Error fetching machine params:', error);
    throw error;
  }
};

export default {
  getAll,
  create,
  getById,
  getByMachineId,
  distroy,
  updateById,
  getSelectList,
  getParamsOption,
};
