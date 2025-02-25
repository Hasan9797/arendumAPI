import { OrderStatus } from '../../enums/order/order-status.enum.js';
import redisSetHelper from '../../helpers/redis-set-helper.js';
import orderService from '../../services/order.service.js';
import { verifyToken } from '../../helpers/jwt-token.helper.js';

export default (io) => {
  const driverNamespace = io.of('/driver');

  driverNamespace.use((socket, next) => {
    try {
      const token = socket.handshake.headers['auth'];

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

  driverNamespace.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinRoom', (orderId) => {
      socket.join(`order_room_${orderId}`);
      socket.emit('orderStatus', { status: true, orderId });
    });

    socket.on('acceptOrder', async ({ orderId, driverName, driverPhone }) => {
      const stillExists = await redisSetHelper.isNotificationStopped(
        String(orderId)
      );

      if (stillExists === true) {
        socket.emit('orderDriverAccept', { success: false });
        return;
      }

      socket.join(`order_room_${orderId}`);

      await orderService.updateOrder(orderId, {
        driverId: parseInt(socket.userId),
        status: OrderStatus.ASSIGNED,
      });

      // io.to(`order_room_${orderId}`).emit('orderAccepted', {
      //   success: true,
      //   driverName,
      //   driverPhone,
      // });

      io.of('/client')
        .to(`order_room_${orderId}`)
        .emit('orderAccepted', {
          success: true,
          driverName,
          driverPhone
        });

      socket.emit('acceptedOrder', { success: true });

      await redisSetHelper.stopNotificationForOrder(String(orderId));

    });

    socket.on('updateLocation', async ({ orderId, location }) => {
      io.of('/client')
        .to(`order_room_${orderId}`)
        .emit('driverLocation', location);
    });

    socket.on('icame', async ({ orderId }) => {
      await orderService.updateOrder(orderId, {
        status: OrderStatus.ARRIVED,
      });
    });

    socket.on('disconnect', async () => { });
  });
};
