import prisma from '../config/prisma.js';

export const findAll = async (query) => {
  const { page, limit, sort, filters, role } = query;

  const skip = (page - 1) * limit;

  try {
    let where = role; // { driverId: 1 } or { clientId: 1 } or {};

    filters.forEach((filter) => {
      let { column, operator, value } = filter;

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

    const orders = await prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        machine: {
          select: {
            id: true,
            title: true,
            img: true,
          },
        },
        client: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        driver: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });

    const total = await prisma.order.count({ where });

    const sanitizedOrders = orders.map(
      ({ driverId, clientId, machineId, ...rest }) => rest
    );

    return {
      data: sanitizedOrders,
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

const create = async (newOrder) => {
  try {
    return await prisma.order.create({
      data: newOrder,
    });
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  return await prisma.order.findUnique({
    where: { id },
  });
};

const updateById = async (id, orderData) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: orderData,
    });
    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await prisma.order.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export default {
  findAll,
  getById,
  create,
  updateById,
  deleteById,
};
