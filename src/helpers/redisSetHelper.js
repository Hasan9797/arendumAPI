import redisClient from '../config/redis.js';

async function startNotificationForOrder(orderId) {
  if (typeof orderId !== 'string') {
    orderId = String(orderId);
  }

  const exists = await redisClient.exists('active_orders'); // Set mavjudligini tekshirish

  if (!exists) {
    // Set mavjud emas -> yangi Set yaratamiz va 24 soatga o‘rnatamiz
    await redisClient.sAdd('active_orders', orderId);
    await redisClient.expire('active_orders', 86400); // 86400 sekund = 24 soat
  } else {
    // Set mavjud -> faqat order qo‘shiladi, expire yangilanmaydi
    await redisClient.sAdd('active_orders', orderId);
  }
}


async function stopNotificationForOrder(orderId) {
  if (typeof orderId !== 'string') {
    orderId = String(orderId);
  }
  await redisClient.sRem('active_orders', orderId); // Faqat shu orderId'ni o‘chiramiz
}

async function isNotificationStopped(orderId) {
  if (typeof orderId !== 'string') {
    orderId = String(orderId);
  }
  const exists = await redisClient.sIsMember('active_orders', orderId);
  return !exists; // Agar o‘chirilmagan bo‘lsa, false qaytaradi
}

export default {
  startNotificationForOrder,
  stopNotificationForOrder,
  isNotificationStopped,
};
