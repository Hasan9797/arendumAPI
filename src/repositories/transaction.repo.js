import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/whereFilterHelper.js';

const getAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters);

    const orderBy = { [sort.column]: sort.value };

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { region: true },
    });

    const total = await prisma.transaction.count({ where });

    // const regionNameKey = lang === 'uz' ? 'nameUz' : 'nameRu';

    // const data = transactions.map(
    //   ({ nameRu, nameUz, nameEn, regionId, region, ...rest }) => ({
    //     ...rest,
    //     name: lang === 'ru' ? nameRu : nameUz,
    //     region: region[regionNameKey],
    //   })
    // );

    return {
      data: transactions,
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
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    return {};
  }
  //   const adjustName = ({ nameRu, nameUz, nameEn, ...res }) => {
  //     return {
  //       ...res,
  //       name: lang === 'ru' ? nameRu : nameUz,
  //       nameRu,
  //       nameUz,
  //       nameEn,
  //     };
  //   };
  return transaction;
};

const create = async (body) => {
  try {
    return await prisma.transaction.create({
      data: body,
    });
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, newData) => {
  try {
    return await prisma.transaction.update({
      where: { id },
      data: newData,
    });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await prisma.transaction.delete({
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
};
