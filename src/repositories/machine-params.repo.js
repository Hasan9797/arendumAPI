import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/where-filter-helper.js';

export const getAll = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters, lang);

    const orderBy = { [sort.column]: sort.value };

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
      ({ nameUz, nameRu, nameEn, machineId, ...rest }) => ({
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
            id: true,
            nameEn: true,
            nameRu: true,
            nameUz: true,
            status: true,
            img: true,
          },
        },
      },
    });

    const adjustName = (obj) => {
      if (!obj) return {};
      
      const { nameRu, nameUz, nameEn, machineId, machines, ...rest } = obj;

      const machine = {
        ...machines,
        name: lang === 'ru' ? machines.nameRu : machines.nameUz,
      };

      return {
        ...rest,
        name: lang === 'ru' ? nameRu : nameUz,
        nameRu,
        nameUz,
        nameEn,
        machine,
      };
    };

    return adjustName(machine);
  } catch (error) {
    throw error;
  }
};

const getByMachineId = async (machineId, lang = 'ru') => {
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
    throw error;
  }
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
        key: true,
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
  getParamsOption,
};
