import orderService from '../services/order.service.js';
import driverService from '../services/driver.service.js';
import redisSetHelper from '../helpers/redisSetHelper.js';

async function orderDriverSearchScheduler() {
  try {
    const orders = await orderService.getOrdersForCron();

    if (!orders || orders.length === 0) return;

    for (const order of orders) {
      const drivers = await driverService.getDriversForNewOrder(
        order.machineId,
        order.region,
        order.structureId,
        order.params,
        order.paymentType
      );

      if (!drivers || drivers.length === 0) continue;

      const title = 'New Order';
      const body = 'You have a new order';
      const data = {
        key: 'new_order',
        order: JSON.stringify(order),
      };

      await redisSetHelper.startNotificationForOrder(String(order.id));

      // Send notification to drivers
      for (const driver of drivers) {
        const orderExists = await redisSetHelper.isNotificationStopped(
          String(order.id)
        );

        if (orderExists === true) break;

        await sendNotification(driver?.fcmToken, title, body, data);

        await new Promise((resolve) => setTimeout(resolve, 5000));

        const stillExists = await redisSetHelper.isNotificationStopped(
          String(order.id)
        );

        if (stillExists === true) break;
      }

      // Send Reload new orders page message to drivers
      const DriverSocket = SocketService.getSocket('driver');

      DriverSocket.to(`drivers_room_${order.regionId}_${order.machineId}`).emit(
        'reloadNewOrders',
        order
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

await orderDriverSearchScheduler();
