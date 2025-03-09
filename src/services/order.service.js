import orderRepo from '../repositories/order.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import {
  OrderStatus,
  getStatusText,
} from '../enums/order/order-status.enum.js';
import orderCalculateWorkHelper from '../helpers/order-calculate-work.helper.js';
import orderType from '../enums/order/order-type.enum.js';
import { getAmountTypeText } from '../enums/pay/payment-type.enum.js';
import machinePriceService from './machine-price.service.js';
import structureService from './structure.service.js';
import machineService from './machines.service.js';

const getOrders = async (query) => {
  try {
    const orders = await orderRepo.findAll(query);

    if (!orders) return [];

    const sanitizedOrders = orders.data.map((order) => ({
      ...order,
      amountType: {
        id: order.amountType,
        text: getAmountTypeText(order.amountType),
      },
      status: { id: order.status, text: getStatusText(order.status) },
    }));

    const data = sanitizedOrders.map(
      ({ driverId, clientId, machineId, ...rest }) => rest
    );

    return {
      data: formatResponseDates(data),
      pagination: orders.pagination,
    };
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (id, lang = 'ru') => {
  try {
    const order = await orderRepo.getById(id);

    if (!order) {
      throw new Error('Order not found');
    }

    const machine = await machineService.getMachineById(order.machineId, lang);
    const machinePrice = await machinePriceService.getPriceByMachineId(
      order.machineId
    );
    const structure = await structureService.getById(order.structureId, lang);

    const sanitizedOrders = ({
      driverId,
      clientId,
      machineId,
      structureId,
      ...rest
    }) => {
      return {
        ...rest,
        amountType: {
          id: rest.amountType,
          text: getAmountTypeText(rest.amountType),
        },
        status: { id: rest.status, text: getStatusText(rest.status) },
        machine,
        machinePrice,
        structure,
      };
    };

    const formattedOrders = formatResponseDates(order);
    return sanitizedOrders(formattedOrders);
  } catch (error) {
    throw error;
  }
};

const createOrder = async (data) => {
  try {
    if (!data.clientId || !data.machineId) {
      throw new Error('Client ID is required');
    }
    return await orderRepo.create(data);
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
      throw new Error('Order is not new');
    }

    return await orderRepo.updateById(orderId, {
      startHour: String(Math.floor(Date.now() / 1000)),
      status: OrderStatus.START_WORK,
    });
  } catch (error) {
    throw error;
  }
};

//End Order and Calculate Work (Time or Km) amount
const endOrder = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');

    const order = await orderRepo.getById(orderId);
    if (!order || order.status != OrderStatus.START_WORK) {
      throw new Error('Order is not started');
    }

    // 1. Order Tukash vaqti (soniyalarda)
    const endHour = String(Math.floor(Date.now() / 1000));
    let updateData = { totalAmount: order.amount };

    // 1. Order type bo'yicha hisoblash
    switch (String(order.type)) {
      case orderType.hour:
        updateData = orderCalculateWorkHelper.calculateWorkTimeAmount({
          ...order,
          endHour,
        });
        break;
      case orderType.km:
        updateData = orderCalculateWorkHelper.calculateWorkKmAmount(order);
        break;
      default:
        updateData;
    }

    return await orderRepo.updateById(orderId, {
      endHour,
      status: OrderStatus.COMPLETED,
      ...updateData,
    });
  } catch (error) {
    throw error;
  }
};

const getNewOrderByDriverParams = async (driverParams, structureId) => {
  try {
    let orders = await orderRepo.getNewOrderByStructureId(structureId);
    if (!orders) return [];

    orders.forEach((order) => {
      order.amountType = getAmountTypeText(order.amountType);
    });

    return filterOrdersByDriverParams(orders, driverParams);
  } catch (error) {
    throw error;
  }
};

function filterOrdersByDriverParams(orders, driverParams) {
  if (!driverParams) return [];

  const driverMap = new Map(
    driverParams.map((d) => [
      d.key,
      Array.isArray(d.params) ? d.params : [d.params],
    ])
  );

  return orders.filter((order) => {
    if (!order.params || !Array.isArray(order.params)) return false; // 🔹 order.params yo‘q bo‘lsa, o‘tib ketish

    return order.params.every((orderParam) => {
      const driverValues = driverMap.get(orderParam.key);
      return driverValues && driverValues.includes(orderParam.param);
    });
  });
}

const getOrderByDriverId = async (lang, driverId) => {
  try {
    const order = await orderRepo.getOrderByDriverId(lang, driverId);

    if (!order) {
      throw new Error('Order not found');
    }

    const machine = await machineService.getMachineById(order.machineId, lang);
    const machinePrice = await machinePriceService.getPriceByMachineId(
      order.machineId
    );
    const structure = await structureService.getById(order.structureId, lang);

    const sanitizedOrders = ({ driverId, clientId, machineId, ...rest }) => {
      return {
        ...rest,
        amountType: {
          id: rest.amountType,
          text: getAmountTypeText(rest.amountType),
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
      throw new Error('Order not found');
    }

    const machine = await machineService.getMachineById(order.machineId, lang);
    const machinePrice = await machinePriceService.getPriceByMachineId(
      order.machineId
    );
    const structure = await structureService.getById(order.structureId, lang);

    const sanitizedOrders = ({ driverId, clientId, machineId, ...rest }) => {
      return {
        ...rest,
        amountType: {
          id: rest.amountType,
          text: getAmountTypeText(rest.amountType),
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

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  startOrder,
  endOrder,
  getOrderByDriverId,
  getOrderByClientId,
  getNewOrderByDriverParams,
};
