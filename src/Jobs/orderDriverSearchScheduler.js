import orderService from '../services/order.service.js';
import driverService from '../services/driver.service.js';
import { sendNotification } from '../helpers/sendNotificationHelper.js';

async function orderDriverSearchScheduler() {
  try {
    console.log('📅 Cron ishga tushdi: orderDriverSearchScheduler');
    const drivers = await driverService.getDriversForCronJob();
    console.log('Drivers found: ', drivers.length);

    for (const driver of drivers) {
      const orders = await orderService.getPlannedOrderByDriverId(driver.id);
      console.log(`Orders for driver ${driver.id}: `, orders.length);

      if (!orders || orders.length === 0) {
        console.log(`No planned orders for driver ${driver.id}`);
        continue;
      }

      for (const order of orders) {
        const orderStartAt = order.startAt ? new Date(order.startAt) : null;

        if (!orderStartAt || isNaN(orderStartAt)) {
          console.log(`Invalid startAt for order ${order.id}: ${order.startAt}`);
          continue;
        }

        const now = new Date();
        const nowUTC = new Date(now.toUTCString());
        const timeDifference = orderStartAt.getTime() - nowUTC.getTime();
        const secondsLeft = Math.floor(timeDifference / 1000);
        const minutesLeft = Math.floor(secondsLeft / 60);
        const hoursLeft = Math.floor(minutesLeft / 60);

        console.log(
          `Order ${order.id} - startAt: ${order.startAt}, ` +
          `now: ${nowUTC.toISOString()}, seconds left: ${secondsLeft}, ` +
          `minutes left: ${minutesLeft}, hours left: ${hoursLeft}, ` +
          `orderId type: ${typeof order.id}`
        );

        if (secondsLeft <= 0) {
          console.log(`Order ${order.id} has already passed`);
          continue;
        }

        if (secondsLeft <= 2 * 60 * 60) {
          console.log(
            `Order ${order.id} is within 2 hours: ${secondsLeft} seconds ` +
            `(${minutesLeft} minutes) left`
          );

          const title = 'Planned Order';
          const body = 'Rejalashtirilgan buyurtma vaqti keldi. \nПришло время для запланированного заказа.';
          const data = { orderId: String(order.id) }; // order.id ni string ga aylantirish

          if (driver?.fcmToken) {
            try {
              console.log(`Sending notification with data:`, data);
              await sendNotification(driver.fcmToken, title, body, data);
              console.log(`Notification sent for order ${order.id} to driver ${driver.id}`);
            } catch (notificationError) {
              console.error(
                `Failed to send notification for order ${order.id} to driver ${driver.id}:`,
                notificationError.response?.data || notificationError.message
              );
            }
          } else {
            console.log(`No FCM token for driver ${driver.id}`);
          }
        } else {
          console.log(
            `Order ${order.id} is more than 2 hours away: ${secondsLeft} seconds ` +
            `(${minutesLeft} minutes) left`
          );
        }
      }
    }
  } catch (error) {
    console.error('Error in orderDriverSearchScheduler:', error);
    throw error;
  }
}

export default orderDriverSearchScheduler;