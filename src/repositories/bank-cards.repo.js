import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/where-filter-helper.js';

const getAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters, lang);

    const orderBy = { [sort.column]: sort.value };

    const cards = await prisma.bankCard.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.bankCard.count({ where });

    return {
      data: cards,
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
  try {
    const bankCard = await prisma.bankCard.findUnique({
      where: { id },
    });

    return bankCard;
  } catch (error) {
    throw error;
  }
};

const createBankCard = async (body) => {
  try {
    return await prisma.bankCard.create({
      data: body,
    });
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, body) => {
  try {
    const updateCard = await prisma.bankCard.update({
      where: { id },
      data: body,
    });
    return updateCard;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await prisma.bankCard.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  getById,
  createBankCard,
  updateById,
  deleteById,
};
