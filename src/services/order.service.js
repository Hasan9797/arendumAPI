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

const calculateFinalWorkTime = async (orderId) => {
  try {
    // 1. Order va OrderPause larini olish
    const order = await orderRepo.getById(orderId);

    if (!order) throw new Error('Order not found');

    // 2. Agar pause bo‘lsa, jami totalTime yig‘iladi, aks holda 0
    const totalPauseTimeInSeconds = order.OrderPause.reduce((total, pause) => total + (pause.totalTime || 0), 0);

    // 3. Umumiy ish vaqtini hisoblash (soniyalarda)
    const totalWorkInSeconds = (order.endHour - order.startHour) - totalPauseTimeInSeconds;

    if (totalWorkInSeconds < 0) throw new Error('Invalid work time calculation');

    // 4. Soat va minutlarga aylantirish (Umumiy Ish Vaqti)
    const totalWorkHour = Math.floor(totalWorkInSeconds / 3600); // Soat
    const totalWorkMinut = Math.floor((totalWorkInSeconds % 3600) / 60); // Minut

    // 5. Soat va minutlarga aylantirish (Umumiy Pause Vaqti)
    const totalPauseHour = Math.floor(totalPauseTimeInSeconds / 3600);
    const totalPauseMinut = Math.floor((totalPauseTimeInSeconds % 3600) / 60);

    // 6. Umumiy miqdor hisoblash
    const totalAmount = 0;

    return {
      totalWorkHour,
      totalWorkMinut,
      totalPauseHour,
      totalPauseMinut,
      totalAmount
    };
  } catch (error) {
    throw error;
  }
};

const updateOrderHourTime = async (orderId, hourType) => {
  try {
    if (hourType == 'startHour') {
      return await orderRepo.orderUpdateHourTime(orderId, { startHour: Math.floor(Date.now() / 1000) });
    }

    const updateTimeData = await calculateFinalWorkTime(orderId);
    return await orderRepo.orderUpdateHourTime(orderId, { endHour: Math.floor(Date.now() / 1000), ...updateTimeData });
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
  updateOrderHourTime
};
