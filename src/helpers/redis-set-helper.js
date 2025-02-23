import redisClient from '../config/redis.js';

async function setMidnightExpiration() {
  const now = new Date();
  now.setHours(24, 0, 0, 0); // Keyingi kunning 00:00 vaqtini olish
  const midnightTimestamp = Math.floor(now.getTime() / 1000); // Sekundlarga o‘girish

  await redisClient.expireAt('active_orders', midnightTimestamp); // Soat 00:00 da o‘chadi
}

async function startNotificationForOrder(orderId) {
  if (typeof orderId !== 'string') {
    orderId = String(orderId);
  }

  const isMember = await redisClient.sIsMember('active_orders', orderId); // Set ichida bor-yo'qligini tekshirish

  if (!isMember) {
    await redisClient.sAdd('active_orders', orderId);
    await setMidnightExpiration(); // Faqat yangi order qo‘shilganda vaqtni o‘rnatish
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
