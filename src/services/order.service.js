import orderRepo from '../repositories/order.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import { OrderStatus } from '../enums/order/order-status.enum.js';
import { calculateWorkTimeAmount, calculateWorkKmAmount } from '../helpers/order-calculate-work.helper.js';
import orderType from '../enums/order/order-type.enum.js';

const getOrders = async (query) => {
  try {
    const orders = await orderRepo.findAll(query);
    return {
      data: formatResponseDates(orders.data),
      pagination: orders.pagination,
    };
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (id) => {
  const order = await orderRepo.getById(id);
  return formatResponseDates(order);
};

const createOrder = async (data) => {
  try {
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
    return await orderRepo.updateById(orderId, { startHour: Math.floor(Date.now() / 1000) });
  } catch (error) {
    throw error;
  }
}

//End Order and Calculate Work (Time or Km) amount
const endOrder = async (orderId) => {
  try {
    const order = await orderRepo.getById(orderId);

    if (!order) throw new Error('Order not found');

    let updateData = {};

    if (String(order.type) == orderType.hour) {
      updateData = calculateWorkTimeAmount(order);
    }

    return await orderRepo.updateById(orderId, { endHour: Math.floor(Date.now() / 1000), ...updateData });
  } catch (error) {
    throw error;
  }
}

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  startOrder,
  endOrder
};
