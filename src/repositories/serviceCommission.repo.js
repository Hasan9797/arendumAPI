import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/whereFilterHelper.js';

const getAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters);

    const orderBy = { [sort.column]: sort.value };

    const serviceCommissions = await prisma.serviceCommission.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.serviceCommission.count({ where });

    return {
      data: serviceCommissions,
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
  const serviceCommission = await prisma.serviceCommission.findUnique({
    where: { id },
  });

  if (!serviceCommission) {
    return null;
  }

  return serviceCommission;
};

const getLastActive = async () => {
  const serviceCommission = await prisma.serviceCommission.findFirst({
    where: { status: 1 },
    orderBy: { createdAt: 'desc' },
  });

  return serviceCommission;
};

const create = async (body) => {
  return await prisma.serviceCommission.create({
    data: body,
  });
};

const updateById = async (id, body) => {
  try {
    const updated = await prisma.serviceCommission.update({
      where: { id },
      data: body,
    });

    return updated;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await prisma.serviceCommission.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getLastActive,
};
