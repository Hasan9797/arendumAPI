import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/where-filter-helper.js';

export const getAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters);

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
    throw error;
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
  try {
    return await prisma.machineParamsFilters.create({
      data: newUser,
    });
  } catch (error) {
    throw error;
  }
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
