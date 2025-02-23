import orderRepo from '../repositories/order.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import { OrderStatus } from '../enums/order/order-status.enum.js';
import orderCalculateWork from '../helpers/order-calculate-work.helper.js';
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
      updateData = orderCalculateWork.calculateWorkTimeAmount(order);
    }

    return await orderRepo.updateById(orderId, { endHour: Math.floor(Date.now() / 1000), ...updateData });
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

// function filterOrdersByDriverParams(orders, driverParams) {
//   // 1. Driver params ni parse qilish
//   driverParams = typeof driverParams === 'string'
//     ? JSON.parse(driverParams)
//     : driverParams;

//   // 2. Driver params'larni Map qilib olish
//   const driverMap = new Map(driverParams.map(d => [d.key, Array.isArray(d.params) ? d.params : [d.params]]));

//   // 3. Orderlarni filter qilish
//   return orders.filter(order => {
//     // Order params'larni parse qilish
//     order.params = typeof order.params === 'string'
//       ? JSON.parse(order.params)
//       : order.params;

//     return order.params.every(orderParam => {
//       const driverValues = driverMap.get(orderParam.key); // Tezkor qidirish uchun Map
//       return driverValues && driverValues.includes(orderParam.param);
//     });
//   });
// }

function filterOrdersByDriverParams(orders, driverParams) {
  // 1. Driver params'larni Map qilib olish
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
