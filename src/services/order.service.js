import orderRepo from '../repositories/order.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import { OrderStatus } from '../enums/order/order-status.enum.js';

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

const updateOrderTime = async (orderId, type) => {
  try {
    return await orderRepo.orderTimeUpdate(orderId, type, OrderStatus.IN_PROGRESS);
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
  updateOrderTime
};
