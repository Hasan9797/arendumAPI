import orderRepo from '../repositories/order.repo.js';

const getOrders = async (query) => {
  return await orderRepo.findAll(query);
};

const getOrderById = async (id) => {
  return await orderRepo.getById(id);
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
