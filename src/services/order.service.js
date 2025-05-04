import orderRepo from '../repositories/order.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';
import { OrderStatus, getStatusText } from '../enums/order/orderStatusEnum.js';
import orderCalculateWorkHelper from '../helpers/orderCalculateWorkHelper.js';
import orderType from '../enums/order/orderTypeEnum.js';
import { getPaymentTypeText } from '../enums/pay/paymentTypeEnum.js';
import machinePriceService from './machinePrice.service.js';
import structureService from './structure.service.js';
import machineService from './machines.service.js';
import SocketService from '../socket/index.js';
import driverService from './driver.service.js';

const getOrders = async (query, lang = 'ru') => {
  try {
    const orders = await orderRepo.findAll(query);

    if (!orders) return [];

    const sanitizedOrders = orders.data.map((order) => ({
      ...order,
      paymentType: {
        id: order.paymentType,
        text: getPaymentTypeText(order.paymentType),
      },
      status: { id: order.status, text: getStatusText(order.status) },
    }));

    const data = sanitizedOrders.map(({ driverId, clientId, machineId, machine, ...rest }) => {
      return {
        ...rest,
        machine: machine
          ? {
              name: lang === 'ru' ? machine?.nameRu || null : machine?.nameUz || null,
              id: machine?.id || null,
              img: machine?.img || null,
            }
          : null,
      };
    });

    return {
      data: formatResponseDates(data),
      pagination: orders.pagination,
    };
  } catch (error) {
    throw error;
  }
};

const getOrdersForCron = async () => {
  try {
    return await orderRepo.getOrderForSchedule();
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (id, lang = 'ru') => {
  try {
    const order = await orderRepo.getById(id);

    if (!order) {
      return null;
    }
    return await orderFormatter(order, lang);
  } catch (error) {
    throw error;
  }
};

const createOrder = async (data) => {
  try {
    const newOrder = await orderRepo.create(data);

    if (!newOrder) {
      throw new Error('Order not created');
    }

    const order = await orderRepo.getCreatedOrder(newOrder.id);

    const serilizedOrder = {
      ...order,
      paymentType: {
        id: order.paymentType,
        text: getPaymentTypeText(order.paymentType),
      },
      status: { id: order.status, text: getStatusText(order.status) },
    };

    return serilizedOrder;
  } catch (error) {
    throw error;
  }
};

const updateOrder = async (id, data) => {
  return await orderRepo.updateById(id, data);
};

const deleteOrder = async (id) => {
  return await orderRepo.deleteById(id);
};

//Start Order
const startOrder = async (orderId) => {
  try {
    const order = await orderRepo.getById(orderId);
    if (!order || order.status !== OrderStatus.ARRIVED) {
      throw new Error('Order not found or driver is not arrived');
    }

    const result = await orderRepo.updateById(orderId, {
      startHour: String(Math.floor(Date.now() / 1000)),
      status: OrderStatus.START_WORK,
    });

    if (result) {
      const clientSocket = SocketService.getSocket('client');

      clientSocket.to(`order_room_${orderId}`).emit('orderStarted', {
        success: true,
        message: 'Order started',
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

//End Order and Calculate Work (Time or Km) amount
const endOrder = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');

    const proseccStatus = [OrderStatus.START_WORK, OrderStatus.PAUSE_WORK];

    const order = await orderRepo.getOrderForCalculate(orderId);
    if (!order || !proseccStatus.includes(order.status)) {
      throw new Error('Order is not started');
    }

    // 1. Order Tukash vaqti (soniyalarda)
    const endHour = String(Math.floor(Date.now() / 1000));
    let updateData = { totalAmount: order.amount };

    // 1. Order type bo'yicha hisoblash
    switch (String(order.type)) {
      case orderType.hour:
        updateData = await orderCalculateWorkHelper.calculateWorkTimeAmount({
          ...order,
          endHour,
        });
        break;
      case orderType.km:
        updateData = await orderCalculateWorkHelper.calculateWorkKmAmount(order);
        break;
      default:
        updateData;
    }

    // 2. Driver boshqa zakas lar uchun ochiq
    await driverService.updateById(order.driverId, { inWork: false });

    const clientSocket = SocketService.getSocket('client');

    clientSocket.to(`order_room_${orderId}`).emit('endOrder', {
      success: true,
      message: 'Order completed',
    });

    return await orderRepo.updateById(orderId, {
      ...updateData,
      endHour,
      status: OrderStatus.COMPLETED,
    });
  } catch (error) {
    throw error;
  }
};

const getNewOrderByDriverParams = async (driverParams, region, structureId, status) => {
  try {
    const orders = await orderRepo.getNewOrder(region, structureId, status);
    if (!orders) return [];

    const sanitizedOrders = orders.map((order) => {
      let orderTotalAmount = order.amount;

      if (order.type === 'hour') {
        orderTotalAmount = order.amount * order.hourCount;
      } else if (order.type === 'km') {
        orderTotalAmount = order.amount * order.kmCount;
      }

      return {
        ...order,
        totalAmount: orderTotalAmount,
        paymentType: {
          id: order.paymentType,
          text: getPaymentTypeText(order.paymentType),
        },
        status: { id: order.status, text: getStatusText(order.status) },
      };
    });

    return filterOrdersByDriverParams(sanitizedOrders, driverParams);
  } catch (error) {
    throw error;
  }
};

function filterOrdersByDriverParams(orders, driverParams) {
  if (!driverParams) return [];

  const driverMap = new Map(driverParams.map((d) => [d.key, Array.isArray(d.params) ? d.params : [d.params]]));

  return orders.filter((order) => {
    if (!order.params || !Array.isArray(order.params)) return false; // 🔹 order.params yo‘q bo‘lsa, o‘tib ketish

    return order.params.every((orderParam) => {
      const driverValues = driverMap.get(orderParam.key);
      return driverValues && driverValues.includes(orderParam.param);
    });
  });
}

const getOrderByDriverId = async (driverId, lang) => {
  try {
    const order = await orderRepo.getOrderByDriverId(driverId);

    if (!order) {
      return null;
    }

    const machine = await machineService.getMachineById(order.machineId, lang);
    const machinePrice = await machinePriceService.getPriceByMachineId(order.machineId);

    let structure = {};

    if (order?.structureId) {
      structure = await structureService.getById(order.structureId, lang);
    }

    const sanitizedOrders = ({ driverId, clientId, machineId, ...rest }) => {
      return {
        ...rest,
        paymentType: {
          id: rest.paymentType,
          text: getPaymentTypeText(rest.paymentType),
        },
        status: { id: rest.status, text: getStatusText(rest.status) },
        startHour: rest.startHour ? rest.startHour.toString() : null,
        endHour: rest.endHour ? rest.endHour.toString() : null,
        machine,
        machinePrice,
        structure,
      };
    };

    const orderFiltered = formatResponseDates(order);
    return sanitizedOrders(orderFiltered);
  } catch (error) {
    throw error;
  }
};

const getOrderByClientId = async (lang, clientId) => {
  try {
    const order = await orderRepo.getOrderByClientId(clientId);

    if (!order) {
      return {};
    }

    const machine = await machineService.getMachineById(order.machineId, lang);
    const machinePrice = await machinePriceService.getPriceByMachineId(order.machineId);
    const structure = await structureService.getById(order.structureId, lang);

    const sanitizedOrders = ({ driverId, clientId, machineId, ...rest }) => {
      return {
        ...rest,
        paymentType: {
          id: rest.paymentType,
          text: getPaymentTypeText(rest.paymentType),
        },
        status: { id: rest.status, text: getStatusText(rest.status) },
        startHour: rest.startHour ? rest.startHour.toString() : null,
        endHour: rest.endHour ? rest.endHour.toString() : null,
        machine,
        machinePrice,
        structure,
      };
    };

    const orderDateFormate = formatResponseDates(order);

    return sanitizedOrders(orderDateFormate);
  } catch (error) {
    throw error;
  }
};

const getCreatedOrder = async (orderId) => {
  try {
    const order = await orderRepo.getCreatedOrder(orderId);

    if (!order) {
      return null;
    }

    return order;
  } catch (error) {
    throw error;
  }
};

const driverArrived = async (orderId) => {
  try {
    const order = await orderRepo.getById(orderId);

    if (!order) {
      return null;
    }

    const result = await orderRepo.updateById(orderId, {
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

const cancelOrder = async (orderId) => {
  try {
    const result = await orderRepo.updateById(orderId, {
      status: OrderStatus.CANCELLED,
    });

    if (!result) {
      throw new Error('Order update error');
    }

    const order = await orderRepo.getCreatedOrder(orderId);

    const preparedOrder = {
      ...order,
      paymentType: {
        id: order.paymentType,
        text: getPaymentTypeText(order.paymentType),
      },
      status: {
        id: order.status,
        text: getStatusText(order.status),
      },
    };

    if (order.driverId) {
      await driverService.updateById(order.driverId, { inWork: false });
    }

    const driverSocket = SocketService.getSocket('driver');

    driverSocket.to(`order_room_${orderId}`).emit('cancelOrder', {
      success: true,
      message: 'Order cancelled',
    });

    driverSocket.to(`drivers_room_${order.regionId}_${order.machineId}`).emit('reloadNewOrders', preparedOrder);
    return result;
  } catch (error) {
    throw error;
  }
};

async function orderFormatter(order, lang = 'ru') {
  let machine = {};

  if (order?.machineId && order.machineId > 0) {
    machine = await machineService.getMachineById(order.machineId, lang);
  }

  const sanitizedOrders = ({ driverId, clientId, ...rest }) => {
    return {
      ...rest,
      paymentType: {
        id: rest.paymentType,
        text: getPaymentTypeText(rest.paymentType),
      },
      status: { id: rest.status, text: getStatusText(rest.status) },
      machine,
    };
  };

  const formattedOrders = formatResponseDates(order);
  return sanitizedOrders(formattedOrders);
}

const isPlannedOrder = async (driverId) => {
  try {
    const order = await orderRepo.getPlannedOrderByDriverId(driverId);
    if (!order || !order.startAt) {
      return false;
    }
    // if order is less than 2 hours
    const expiresAt = Number(order.startAt);
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = expiresAt - now;

    return remainingSeconds <= 7200 && remainingSeconds > 0; // 2 hours
  } catch (error) {
    throw error;
  }
};

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  startOrder,
  endOrder,
  getCreatedOrder,
  getOrderByDriverId,
  getOrderByClientId,
  getNewOrderByDriverParams,
  cancelOrder,
  isPlannedOrder,
};
