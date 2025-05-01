import driverRepository from '../repositories/driver.repo.js';
import redisSetHelper from '../helpers/redisSetHelper.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';
import {
  PAYMENT_TYPE,
  getPaymentTypeText,
} from '../enums/pay/paymentTypeEnum.js';

import orderService from './order.service.js';
import SocketService from '../socket/index.js';
import { OrderStatus, getStatusText } from '../enums/order/orderStatusEnum.js';

const getAll = async (lang, query) => {
  try {
    const result = await driverRepository.findAll(lang, query);
    return {
      data: formatResponseDates(result.data),
      pagination: result.pagination,
    };
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    const driver = await driverRepository.getById(id);
    return formatResponseDates(driver);
  } catch (error) {
    throw error;
  }
};

const getProfile = async (lang, id) => {
  const driver = await driverRepository.getDriverProfile(id);

  if (!driver) return {};

  const formattedDriver = formatResponseDates(driver);

  const adjustName = (obj) => {
    if (!obj) return null;
    const { nameRu, nameUz, ...relationRest } = obj;
    return {
      ...relationRest,
      name: lang === 'ru' ? nameRu : nameUz,
    };
  };

  const serializedDriver = ({ regionId, structureId, machineId, ...rest }) => {
    return {
      ...rest,
      region: adjustName(rest.region),
      structure: adjustName(rest.structure),
      machine: adjustName(rest.machine),
      balance: rest.balance?.balance ?? '0',
    };
  };

  return serializedDriver(formattedDriver);
};

const create = async (data) => {
  try {
    return await driverRepository.create(data);
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, data) => {
  try {
    return await driverRepository.updateById(id, data);
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await driverRepository.deleteById(id);
  } catch (error) {
    throw error;
  }
};

const getDriversForNewOrder = async (
  machineId,
  region,
  structureId,
  orderParams,
  paymentType
) => {
  console.log('orderParams', orderParams);
  console.log('paymentType', paymentType);
  console.log('region', region);
  console.log('structureId', structureId);
  console.log('machineId', machineId);

  try {
    if (!region) throw new Error('Region is required');
    const legal = paymentType === PAYMENT_TYPE.ACCOUNT ? true : false;

    const drivers = await driverRepository.getDriversForNotification(
      machineId,
      region,
      structureId,
      legal
    );

    return filterDriversByOrderParams(drivers, orderParams);
  } catch (error) {
    throw error;
  }
};

const acceptOrder = async (orderId, driver) => {
  const statusArray = [OrderStatus.SEARCHING, OrderStatus.PLANNED];
  try {
    const order = await orderService.getCreatedOrder(orderId);

    if (!order) {
      return null;
    }

    if (!statusArray.includes(order.status)) {
      return false;
    }

    const updatedOrder = await orderService.updateOrder(orderId, {
      status: OrderStatus.ASSIGNED,
      driverId: driver.id,
    });

    if (!updatedOrder) {
      throw new Error('Order update error');
    }

    const preparedOrder = {
      ...order,
      paymentType: {
        id: order.paymentType,
        text: getPaymentTypeText(order.paymentType),
      },
      status: {
        id: updatedOrder.status,
        text: getStatusText(updatedOrder.status),
      },
    };

    if (order.startAt === null) {
      // driver in work
      await driverRepository.updateById(driver.id, { inWork: true });
    }

    await redisSetHelper.stopNotificationForOrder(String(orderId));
    const clientSocket = SocketService.getSocket('client');
    const DriverSocket = SocketService.getSocket('driver');

    clientSocket.to(`order_room_${orderId}`).emit('orderAccepted', {
      success: true,
      driver,
    });

    DriverSocket.to(`drivers_room_${order.regionId}_${order.machineId}`).emit(
      'reloadNewOrders',
      preparedOrder
    );

    return {
      success: true,
      orderId,
    };
  } catch (error) {
    throw error;
  }
};

const driverArrived = async (orderId) => {
  try {
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return null;
    }

    const result = await orderService.updateOrder(orderId, {
      status: OrderStatus.ARRIVED,
      driverArrivedTime: String(Math.floor(Date.now() / 1000)),
    });

    if (!result) {
      throw new Error('Order update error');
    }

    const clientSocket = SocketService.getSocket('client');

    clientSocket.to(`order_room_${orderId}`).emit('driverArrived', {
      success: true,
    }); // 🔹 driverArrived eventi

    return {
      success: true,
      orderId,
    };
  } catch (error) {
    throw error;
  }
};

function filterDriversByOrderParams(drivers, orderParams) {
  if (!orderParams || orderParams.length === 0) return [];

  return drivers.filter((driver) => {
    if (!driver.params || !Array.isArray(driver.params)) return false;

    // orderParams dagi har bir itemni tekshiradi
    return orderParams.every(({ key, param }) => {
      const match = driver.params.find((p) => p.key === key);

      // driver da shu key bo'lishi va uning params arrayida param bo'lishi kerak
      return (
        match && Array.isArray(match.params) && match.params.includes(param)
      );
    });
  });
}

//Driverga order qabul qilaolishini tekshirish
function canTakeNewOrder(driverId) {}

export default {
  getAll,
  getById,
  getProfile,
  create,
  updateById,
  deleteById,
  getDriversForNewOrder,
  acceptOrder,
  driverArrived,
};
