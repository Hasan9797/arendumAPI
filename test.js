import redisClient from './src/config/redis.js';

const now = new Date();
now.setHours(24, 0, 0, 0); // Keyingi kunning 00:00 vaqtini olish
const midnightTimestamp = Math.floor(now.getTime() / 1000); // Sekundlarga o‘girish

async function startNotificationForOrder(orderId) {
  if (!orderId || typeof orderId !== 'string') {
    orderId = String(orderId); // Agar raqam bo‘lsa, stringga o‘girib yuboramiz
  }

  const exists = await redisClient.exists('active_orders');

  if (!exists) {
    await redisClient.sAdd('active_orders', orderId);
    await redisClient.expireAt('active_orders', midnightTimestamp); // Soat 00:00 da o‘chadi
  } else {
    await redisClient.sAdd('active_orders', orderId);
  }
}

async function getAllActiveOrders() {
  const orders = await redisClient.sMembers('active_orders');
  if (!orders) {
    console.log('🔹 No active orders found.');

    return null;
  }
  console.log('🔹 Active Orders:', orders);
  return orders;
}

async function stopNotificationForOrder(orderId) {
  if (!orderId || typeof orderId !== 'string') {
    orderId = String(orderId);
  }
  await redisClient.sRem('active_orders', orderId); // Faqat shu orderId'ni o‘chiramiz
}

async function isNotificationStopped(orderId) {
  if (!orderId || typeof orderId !== 'string') {
    orderId = String(orderId);
  }
  const exists = await redisClient.sIsMember('active_orders', orderId);
  return !exists; // Agar o‘chirilmagan bo‘lsa, false qaytaradi
}


async function runTests() {
  //   await startNotificationForOrder('2'); // String formatda yuborish
  //   await stopNotificationForOrder('1');
  //   const isStopped = await isNotificationStopped('1');

  await getAllActiveOrders();
}

runTests()
  .then(() => console.log('Tests passed!'))
  .catch((err) => console.error('❌ Test failed:', err));
