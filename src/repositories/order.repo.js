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
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, orderData) => {
  try {
    return await prisma.order.update({
      where: { id },
      data: orderData,
    });
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

const getNewOrder = async (region, structureId) => {
  const whereData = {
    status: OrderStatus.SEARCHING,
    ...(region.isOpen ? { regionId: region.id } : { structureId }),
  };

  return prisma.order.findMany({
    where: whereData,
    include: {
      client: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
      machine: {
        select: {
          id: true,
          name: true,
          nameRu: true,
          nameUz: true,
          img: true,
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
    },
  });
};

const getProcessOrderByDriverId = async (driverId) => {
  try {
    if (!driverId) throw new Error('Driver ID is required');
    return await prisma.order.findFirst({
      where: {
        driverId,
        status: {
          in: [OrderStatus.DRIVER_ON_WAY, OrderStatus.ARRIVED, OrderStatus.START_WORK, OrderStatus.PAUSE_WORK],
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

const getProcessOrderByClientId = async (clientId) => {
  try {
    return await prisma.order.findFirst({
      where: {
        clientId,
        status: {
          in: [OrderStatus.DRIVER_ON_WAY, OrderStatus.ARRIVED, OrderStatus.START_WORK, OrderStatus.PAUSE_WORK],
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

// Client Socket dan yuborishi uchun kerakli relation bilan
const getCreatedOrder = async (id) => {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        machine: {
          select: {
            id: true,
            name: true,
            nameRu: true,
            nameUz: true,
            img: true,
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
      },
    });
  } catch (error) {
    throw error;
  }
};

const getOrderForCalculate = async (id) => {
  try {
    return await prisma.order.findUnique({
      where: { id },
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
      },
    });
  } catch (error) {
    throw error;
  }
};


const getPlannedOrdersByDriverId = async (driverId) => {
  try {
    return await prisma.order.findMany({
      where: {
        driverId,
        isPlanned: true,
        status: OrderStatus.ASSIGNED,
      },
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

const getDriverPlannedOrders = async () => {
  try {
    return await prisma.order.findMany({
      where: {
        isPlanned: true,
        isDriverNotified: false,
        status: OrderStatus.ASSIGNED,
      },
      include: {
        driver: {
          select: {
            id: true,
            fcmToken: true,
          },
        },
      },
      // take: 10, // limit 10 ta
    });
  } catch (error) {
    throw error;
  }
};


export default {
  findAll,
  getById,
  create,
  getCreatedOrder,
  updateById,
  deleteById,
  getProcessOrderByDriverId,
  getProcessOrderByClientId,
  getNewOrder,
  getOrderForCalculate,
  getPlannedOrdersByDriverId,
  getDriverPlannedOrders,
};
