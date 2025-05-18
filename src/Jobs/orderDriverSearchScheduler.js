import orderService from '../services/order.service.js';
import driverService from '../services/driver.service.js';
import SocketService from '../socket/index.js';
import { sendNotification } from '../helpers/sendNotificationHelper.js';

async function orderDriverSearchScheduler() {
  try {
    const drivers = await driverService.getDriversForCronJob();

    for (const driver of drivers) {
      const orders = await orderService.getPlannedOrderByDriverId(driver.id);

      if (!orders || orders.length === 0) continue;

      for (const order of orders) {
        const title = 'Planned Order';
        const body = 'You have a planned order';
        const data = { orderId: order.id };

        const now = Math.floor(Date.now() / 1000);
        const orderStartAt = order.startAt ? Math.floor(new Date(order.startAt).getTime() / 1000) : null;

        if (!orderStartAt) {
          continue;
        }

        const secondsLeft = orderStartAt - now;

        if (secondsLeft <= 0) {
          continue; // bu allaqachon o‘tib ketgan
        }

        // Agar 2 soat yoki undan kam vaqt qolgan bo‘lsa
        if (secondsLeft <= 2 * 60 * 60) {
          // NOTIFICATION YUBORISH
          await sendNotification(driver?.fcmToken, title, body, data);
        }

        // const DriverSocket = SocketService.getSocket('driver');
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default orderDriverSearchScheduler;
