import { sendNotification } from '../../helpers/send-notification.helper.js';
import driverService from '../../services/driver.service.js';
import { verifyToken } from '../../helpers/jwt-token.helper.js';
import userRoleEnum from '../../enums/user/user-role.enum.js';

export default (io) => {
  const clientNamespace = io.of('/client');

  clientNamespace.use((socket, next) => {
    try {
      const { token } = socket.handshake.auth;

      if (!token) {
        return next(new Error('Access denied, no token provided'));
      }

      const user = verifyToken(token);

      if (!user) {
        return next(new Error('User error'));
      }

      socket.userId = user.id;
      socket.role = user.role;

      next();
    } catch (error) {
      console.log(error);
      socket.emit('error', { message: error.message });
    }
  });

  clientNamespace.on('connection', (socket) => {
    try {
      console.log(`Socket connected: ${socket.id}`);

      console.log('Socket role:', socket.role);
      console.log('Socket userId:', socket.userId);

      socket.on('joinRoom', (orderId) => {
        socket.join(`order_room_${orderId}`);
        socket.emit('orderStatus', { status: true, orderId });
      });

      socket.on('createOrder', async ({ orderId }) => {
        socket.join(`order_room_${orderId}`);

        const drivers = await driverService.getDriversInClientStructure(
          socket.userId
        );

        if (drivers.length <= 0) {
          socket.emit('driverNotFound', { message: 'Driver not found' });
          return;
        }

        const title = 'New Order';
        const body = 'You have a new order';

        const data = {
          key: 'new_order',
          orderId: String(orderId),
        };

        let driverJoined = false;

        for (const driver of drivers) {
          if (driverJoined) break;

          await sendNotification(driver?.fcmToken, title, body, data);

          // Har 5 soniyada haydovchi tekshirish
          await new Promise((resolve) => setTimeout(resolve, 5000));

          const room = io.sockets.adapter.rooms.get(`order_room_${orderId}`);
          if (room && room.size > 1) {
            for (const socketId of room) {
              const socket = io.sockets.sockets.get(socketId);

              if (socket && socket.role == userRoleEnum.DRIVER) {
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
    } catch (error) {
      console.log(error);
      socket.emit('error', { message: error.message });
    }
  });
};
