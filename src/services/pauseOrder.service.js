import { OrderStatus } from '../enums/order/orderStatusEnum.js';
import orderPauseRepo from '../repositories/pauseOrder.repo.js';
import orderService from './order.service.js';
import SocketService from '../socket/index.js';

const startPauseTime = async (orderId) => {
  try {
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const orderPause = await orderPauseRepo.createStartPause(orderId);

    await orderService.updateOrder(order.id, {
      status: OrderStatus.PAUSE_WORK,
    });

    const clientSocket = SocketService.getSocket('client');

    clientSocket.to(`order_room_${orderId}`).emit('startOrderPause', {
      success: true,
      message: 'Start order pause',
    });

    return orderPause;
  } catch (error) {
    throw error;
  }
};

const endPauseTime = async (orderId) => {
  const order = await orderService.getOrderById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  const orderPause = await orderPauseRepo.updateEndPause(orderId);

  await orderService.updateOrder(order.id, {
    status: OrderStatus.START_WORK,
  });

  const clientSocket = SocketService.getSocket('client');

  clientSocket.to(`order_room_${orderId}`).emit('endOrderPause', {
    success: true,
    message: 'End order pause',
  });

  return orderPause;
};

export default {
  startPauseTime,
  endPauseTime,
};
