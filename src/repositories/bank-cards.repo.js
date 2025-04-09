import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/where-filter-helper.js';

const getAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters);

    const orderBy = { [sort.column]: sort.value };

    const cards = await prisma.bankCard.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        }, driver: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        }
      },
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
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        }, driver: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        }
      },
    });

    return bankCard;
  } catch (error) {
    throw error;
  }
};

const getByClientId = async (clientId) => {
  try {
    const bankCards = await prisma.bankCard.findMany({
      where: { clientId },
    });

    return bankCards;
  } catch (error) {
    throw error;
  }
};

const getByDriverId = async (driverId) => {
  try {
    const bankCards = await prisma.bankCard.findMany({
      where: { driverId },
    });

    return bankCards;
  } catch (error) {
    throw error;
  }
};

const createBankCard = async (driverId, clientId, body) => {
  try {
    return await prisma.bankCard.create({
      data: {
        driverId,
        clientId,
        cardId: body.card_id,
        pan: body.pan,
        cardHolder: body.card_holder,
        balance: body.balance,
        phone: body.phone,
        expiry: body.expiry,
        cardToken: body.card_token,
        status: 1,
      },
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
  getByClientId,
  getByDriverId,
  createBankCard,
  updateById,
  deleteById,
};
