import orderService from '../services/order.service.js';
import driverService from '../services/driver.service.js';
import { sendNotification } from '../helpers/sendNotificationHelper.js';

async function orderDriverSearchScheduler() {
  try {
    // Faol driverlarni olish
    const drivers = await driverService.getDriversForCronJob();
    console.log('Drivers found: ', drivers.length);

    // Har bir driver uchun
    for (const driver of drivers) {
      // Driverning rejalashtirilgan zakazlarini olish
      const orders = await orderService.getPlannedOrderByDriverId(driver.id);
      console.log(`Orders for driver ${driver.id}: `, orders.length);

      // Agar zakazlar bo'lmasa, keyingi driverga o'tish
      if (!orders || orders.length === 0) {
        continue;
      }

      // Har bir zakazni tekshirish
      for (const order of orders) {
        // Zakaz boshlanish vaxtini olish
        const orderStartAt = order.startAt ? new Date(order.startAt) : null;

        // Agar startAt mavjud bo'lmasa, keyingi zakazga o'tish
        if (!orderStartAt || isNaN(orderStartAt)) {
          continue;
        }

        // Hozirgi vaxtni olish
        const now = new Date();

        // Vaqtlar farqini millisekundlarda hisoblash
        const timeDifference = orderStartAt.getTime() - now.getTime();
        const secondsLeft = Math.floor(timeDifference / 1000); // Sekundlarga aylantirish
        console.log(`Order ${order.id} - seconds left: ${secondsLeft}`);

        // Agar zakaz allaqachon o'tib ketgan bo'lsa, o'tkazib yuborish
        if (secondsLeft <= 0) {
          console.log(`Order ${order.id} has already passed`);
          continue;
        }

        // Agar 2 soat yoki undan kam vaqt qolgan bo'lsa
        if (secondsLeft <= 2 * 60 * 60) {
          console.log(`Order ${order.id} is within 2 hours: ${secondsLeft} seconds left`);

          // Notification ma'lumotlarini tayyorlash
          const title = 'Planned Order';
          const body = 'You have a planned order';
          const data = { orderId: order.id };

          // Notification yuborish
          if (driver?.fcmToken) {
            await sendNotification(driver.fcmToken, title, body, data);
            console.log(`Notification sent for order ${order.id} to driver ${driver.id}`);
          } else {
            console.log(`No FCM token for driver ${driver.id}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in orderDriverSearchScheduler:', error);
    throw error;
  }
}

export default orderDriverSearchScheduler;