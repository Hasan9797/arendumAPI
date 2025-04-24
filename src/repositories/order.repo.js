import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/whereFilterHelper.js';
import orderType from '../enums/order/orderTypeEnum.js';
import { OrderStatus } from '../enums/order/orderStatusEnum.js';

const findAll = async (query) => {
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

    return {
      data: orders,
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
    return await prisma.order.create({
      data: data,
    });
  } catch (error) {
    throw error;
  }
};

const getById = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');

    return await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderPause: {
          select: {
            id: true,
            startPause: true,
            endPause: true,
            status: true,
            totalTime: true,
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
        region: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
            isOpen: true,
          },
        },
        structure: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
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

const getNewOrderBy = async (region, structureId) => {
  const whereData = region.isOpen === true ? {
    regionId: region.id,
    status: OrderStatus.SEARCHING,
  } : { structureId: structureId, status: OrderStatus.SEARCHING };

  try {
    return await prisma.order.findMany({
      where: whereData,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

const getOrderByDriverId = async (lang, driverId) => {
  try {
    return await prisma.order.findFirst({
      where: {
        driverId: driverId,
        status: {
          in: [
            OrderStatus.ASSIGNED,
            OrderStatus.ARRIVED,
            OrderStatus.START_WORK,
            OrderStatus.PAUSE_WORK,
          ],
        },
      },
      include: {
        orderPause: {
          select: {
            id: true,
            startPause: true,
            endPause: true,
            status: true,
            totalTime: true,
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
      orderBy: {
        id: 'desc', // { id: 'desc' }
      },
    });
  } catch (error) {
    throw error;
  }
};

const getOrderByClientId = async (clientId) => {
  try {
    return await prisma.order.findFirst({
      where: {
        clientId,
        status: {
          in: [
            OrderStatus.ASSIGNED,
            OrderStatus.ARRIVED,
            OrderStatus.START_WORK,
            OrderStatus.PAUSE_WORK,
          ],
        },
      },
      include: {
        orderPause: {
          select: {
            id: true,
            startPause: true,
            endPause: true,
            status: true,
            totalTime: true,
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
      orderBy: {
        id: 'desc', // { id: 'desc' }
      },
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
  getOrderByDriverId,
  getOrderByClientId,
  getNewOrderBy,
};
