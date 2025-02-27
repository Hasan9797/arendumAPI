import orderRepo from '../repositories/order.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import { OrderStatus } from '../enums/order/order-status.enum.js';
import orderCalculateWorkHelper from '../helpers/order-calculate-work.helper.js';
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
    return await orderRepo.updateById(orderId, {
      startHour: Math.floor(Date.now() / 1000),
      status: OrderStatus.START_WORK
    });
  } catch (error) {
    throw error;
  }
}

//End Order and Calculate Work (Time or Km) amount
const endOrder = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');

    const order = await orderRepo.getById(orderId);
    if (!order || order.status != OrderStatus.START_WORK) throw new Error('Order is not started');

    // 1. Order Tukash vaqti (soniyalarda)
    const endHour = Math.floor(Date.now() / 1000);
    let updateData;

    // 1. Order type bo'yicha hisoblash
    switch (String(order.type)) {
      case orderType.hour:
        updateData = orderCalculateWorkHelper.calculateWorkTimeAmount({ ...order, endHour });
        break;
      case orderType.km:
        updateData = orderCalculateWorkHelper.calculateWorkKmAmount(order);
        break;
      default:
        updateData = { totalAmount: order.amount };
    }

    return await orderRepo.updateById(orderId, {
      endHour,
      orderStatus: OrderStatus.COMPLETED,
      ...updateData
    });
  } catch (error) {
    throw error;
  }
}

const getNewOrderByDriverParams = async (driverParams, structureId) => {
  try {
    const orders = await orderRepo.getNewOrderByStructureId(structureId);
    if (!orders) return [];

    return filterOrdersByDriverParams(orders, driverParams);
  } catch (error) {
    throw error;
  }
}

function filterOrdersByDriverParams(orders, driverParams) {
  // 1. Driver params'larni Map qilib olish
  if(!driverParams) return [];

  const driverMap = new Map(
    driverParams.map(d => [d.key, Array.isArray(d.params) ? d.params : [d.params]])
  );

  // 2. Orderlarni filter qilish
  return orders.filter(order =>
    order.params.every(orderParam => {
      const driverValues = driverMap.get(orderParam.key);
      // Har bir objectning key'ga mos driver params bor-yo‘qligini va 
      // param qiymati shu driver array ichida topilishini tekshirish
      return driverValues && driverValues.includes(orderParam.param);
    })
  );
}



export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  startOrder,
  endOrder,
  getNewOrderByDriverParams
};
