import { sendNotification } from '../../helpers/send-notification.helper.js';
import driverService from '../../services/driver.service.js';

export default (io) => {
  const clientNamespace = io.of('/client');

  // clientNamespace.use((socket, next) => {
  //   const { userId, token } = socket.handshake.auth;

  //   if (!userId || token !== process.env.CLIENT_SOCKET_SECRET_KEY) {
  //     return next(new Error('Authentication error'));
  //   }

  //   console.log('Token validated');
  //   next();
  // });

  clientNamespace.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.role = 'client';

    socket.on('joinRoom', (orderId) => {
      socket.join(`order_room_${orderId}`);
      socket.emit('joinedRoom', { success: true });
      console.log(`User joined room: ${orderId}`);
    });

    socket.on('createOrder', async ({ orderId, clientId }) => {
      socket.join(`order_room_${orderId}`);
      const drivers = await driverService.getDriversInClientStructure(clientId);

      if (!drivers.length) {
        socket.emit('driverNotFound', { success: false });
        return;
      }

      const title = 'New Order';
      const body = {
        orderId,
      };

      let driverJoined = false;

      for (const driver of drivers) {
        if (driverJoined) break;

        await sendNotification(driver.fcmToken, title, body);

        // Har 5 soniyada haydovchi tekshirish
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const room = io.sockets.adapter.rooms.get(`order_room_${orderId}`);
        if (room && room.size > 1) {
          for (const socketId of room) {
            const socket = io.sockets.sockets.get(socketId);

            if (socket && socket.role === 'driver') {
              driverJoined = true;
              break;
            }
          }
        }
      }

      if (!driverJoined) {
        socket.emit('driverNotFound', { success: false });
      }
    });

    socket.on('disconnect', async () => {});
  });
};
