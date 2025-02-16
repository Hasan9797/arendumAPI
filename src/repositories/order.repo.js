import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/where-filter-helper.js';
import { orderType } from '../enums/order/order-type.enum.js'

export const findAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters);

    const orderBy = { [sort.column]: sort.value };

    const orders = await prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        machine: {
          select: {
            id: true,
            name: true,
            nameRu: true,
            nameUz: true,
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

const create = async (data) => {
  try {
    return await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: data,
      });

      if (newOrder.type === orderType.hour) {
        await prisma.orderPause.create({
          data: { orderId: newOrder.id },
        });
      }

      return newOrder;
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

const orderTimeUpdate = async (driverId, type, status) => {
  try {
    const hourType = String(type).trim() === 'start' ? 'startHour' : 'endHour';

    const lastOrder = await prisma.order.findFirst({
      where: {
        driverId,
        status,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastOrder) {
      throw new Error('Tegishli order topilmadi');
    }

    return await prisma.order.update({
      where: { id: lastOrder.id },
      data: { [hourType]: new Date() },
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
  orderTimeUpdate
};
