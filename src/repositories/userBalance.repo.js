import prisma from '../config/prisma.js';
import userRoleEnum from '../enums/user/userRoleEnum.js';
import { buildWhereFilter } from '../helpers/whereFilterHelper.js';

const getAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters);

    const orderBy = { [sort.column]: sort.value };

    const balances = await prisma.userBalance.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        driver: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        client: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });

    const total = await prisma.userBalance.count({ where });

    // const regionNameKey = lang === 'uz' ? 'nameUz' : 'nameRu';

    // const data = balances.map(
    //   ({ nameRu, nameUz, nameEn, regionId, region, ...rest }) => ({
    //     ...rest,
    //     name: lang === 'ru' ? nameRu : nameUz,
    //     region: region[regionNameKey],
    //   })
    // );

    return {
      data: balances,
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
  const balance = await prisma.userBalance.findUnique({
    where: { id },
  });

  if (!balance) {
    return {};
  }

  return balance;
};

const getByDriverId = async (driverId) => {
  try {
    const balance = await prisma.userBalance.findFirst({
      where: { driverId },
    });
    return balance;
  } catch (error) {
    throw error;
  }
};

const getByClientId = async (clientId) => {
  try {
    const balance = await prisma.userBalance.findFirst({
      where: { clientId },
    });
    return balance;
  } catch (error) {
    throw error;
  }
};

const create = async (body) => {
  try {
    return await prisma.userBalance.create({
      data: body,
    });
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, newData) => {
  try {
    return await prisma.userBalance.update({
      where: { id },
      data: newData,
    });
  } catch (error) {
    throw error;
  }
};

const updateByDriverId = async (driverId, newData) => {
  try {
    return await prisma.userBalance.update({
      where: { driverId },
      data: newData,
    });
  } catch (error) {
    throw error;
  }
};

const updateByClientId = async (clientId, newData) => {
  try {
    return await prisma.userBalance.update({
      where: { clientId },
      data: newData,
    });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await prisma.userBalance.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  getById,
  getByDriverId,
  getByClientId,
  create,
  updateById,
  deleteById,
  updateByDriverId,
  updateByClientId,
};
