import orderPauseRepo from '../repositories/pause-order.repo.js';
import orderService from '../services/order.service.js';
import SocketService from '../socket/index.js';

const startPauseTime = async (orderId) => {
  try {
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const clientSocket = SocketService.getSocket('client');

    clientSocket.to(`order_room_${orderId}`).emit('startOrderPause', {
      success: true,
      message: 'Start order pause',
    });

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

  const clientSocket = SocketService.getSocket('client');

  clientSocket.to(`order_room_${orderId}`).emit('endOrderPause', {
    success: true,
    message: 'End order pause',
  });

  return await orderPauseRepo.updateEndPause(orderId);
};

export default {
  startPauseTime,
  endPauseTime,
};
