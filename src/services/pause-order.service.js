import orderPauseRepo from '../repositories/pause-order.repo.js';
import orderService from '../services/order.service.js';
import SocketHandler from '../socket/index.js';

const startPauseTime = async (orderId) => {
  try {
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    SocketHandler.sendOrderPauseToClient(orderId);
    return await orderPauseRepo.createStartPause(orderId);
  } catch (error) {
    throw error;
  }
};

const endPauseTime = async (orderId) => {
  const order = await orderService.getOrderById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  return await orderPauseRepo.updateEndPause(orderId);
};

export default {
  startPauseTime,
  endPauseTime,
};
