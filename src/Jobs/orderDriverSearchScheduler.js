import orderService from '../services/order.service.js';
import driverService from '../services/driver.service.js';
import { sendNotification } from '../helpers/sendNotificationHelper.js';

async function orderDriverSearchScheduler() {
  try {
    console.log('📅 Cron ishga tushdi: orderDriverSearchScheduler');
    // const drivers = await driverService.getDriversForCronJob();
    // console.log('Drivers found: ', drivers.length);

    const driverPlannedOrders = await orderService.getDriverPlannedOrders();
    console.log('Driver planned orders: ', driverPlannedOrders);
    
    if (!driverPlannedOrders || driverPlannedOrders.length === 0) {
      return;
    }
    console.log(`Orders for driver ${driverPlannedOrders.driver}: `, driverPlannedOrders.length);

    for (const order of driverPlannedOrders) {

      if (!order?.driver) continue

      const orderStartAt = order.startAt ? new Date(order.startAt) : null;

      if (!orderStartAt || isNaN(orderStartAt)) {
        continue;
      }

      const now = new Date();
      const nowUTC = new Date(now.toUTCString());
      const timeDifference = orderStartAt.getTime() - nowUTC.getTime();
      const secondsLeft = Math.floor(timeDifference / 1000);
      const minutesLeft = Math.floor(secondsLeft / 60);
      const hoursLeft = Math.floor(minutesLeft / 60);

      // console.log(
      //   `Order ${order.id} - startAt: ${order.startAt}, ` +
      //   `now: ${nowUTC.toISOString()}, seconds left: ${secondsLeft}, ` +
      //   `minutes left: ${minutesLeft}, hours left: ${hoursLeft}, ` +
      //   `orderId type: ${typeof order.id}`
      // );

      if (secondsLeft <= 0) {
        // console.log(`Order ${order.id} has already passed`);
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

        if (order?.driver.fcmToken) {
          try {
            // console.log(`Sending notification with data:`, data);
            await sendNotification(order?.driver.fcmToken, title, body, data);
            await orderService.updateOrder(order.id, {
              isDriverNotified: true,
            });
            console.log(`Notification sent for order ${order.id} to driver ${order?.driver.id}`);
          } catch (notificationError) {
            console.error(
              `Failed to send notification for order ${order.id} to driver ${order?.driver.id}:`,
              notificationError.response?.data || notificationError.message
            );
          }
        } else {
          console.log(`Cron Job: No FCM token for driver ${order?.driver.id}`);
        }
      }
    }
  } catch (error) {
    console.error('Error in orderDriverSearchScheduler:', error);
    throw error;
  }
}

export default orderDriverSearchScheduler;