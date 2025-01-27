import orderRepo from '../repositories/order.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getOrders = async (query) => {
  const orders = await orderRepo.findAll(query);
  return formatResponseDates(orders);
};

const getOrderById = async (id) => {
  const order = await orderRepo.getById(id);
  return formatResponseDates(order);
};

const createOrder = async (data) => {
  return await orderRepo.create(data);
};

const updateOrder = async (id, data) => {
  return await orderRepo.updateById(id, data);
};

const deleteOrder = async (id) => {
  return await orderRepo.deleteById(id);
};

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
