import orderService from '../services/order.service.js';
import driverService from '../services/driver.service.js';
import SocketService from '../socket/index.js';

async function orderDriverSearchScheduler() {
  try {

    const drivetrs = await driverService.getAllDrivers();

    for (const driver of drivetrs) {
      const orders = await orderRepo.getPlannedOrdersByDriverId(driver.id);

      if (!orders || orders.length === 0) continue;

      orders.forEach(async (order) => {

        const now = Math.floor(Date.now() / 1000);
        const newOrderStartAt = order.startAt
          ? Math.floor(new Date(order.startAt).getTime() / 1000)
          : null;

        if (!newOrderStartAt){
          
        };
        await sendNotification(driver?.fcmToken, title, body, data);
        // Send Reload new orders page message to drivers
        const DriverSocket = SocketService.getSocket('driver');

        DriverSocket.to(`drivers_room_${order.regionId}_${order.machineId}`).emit(
          'reloadNewOrders',
          order
        );
      })
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}

await orderDriverSearchScheduler();
