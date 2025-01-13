import { OrderStatus } from '../../enums/order/order-status.enum.js';
import orderService from '../../services/order.service.js';

export default (io) => {
  const driverNamespace = io.of('/driver');

  driverNamespace.use((socket, next) => {
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

  driverNamespace.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.role = 'driver';

    socket.on('joinRoom', (orderId) => {
      socket.join(`order_room_${orderId}`);
      console.log(`User joined room: ${orderId}`);
    });

    socket.on('acceptOrder', async ({ orderId, driverName, driverPhone }) => {
      socket.join(orderId);

      await orderService.updateOrder(orderId, {
        driverId: parseInt(socket.userId),
        status: OrderStatus.ASSIGNED,
      });

      io.of('/client')
        .to(`order_room_${orderId}`)
        .emit('orderAccepted', { success: true, driverName, driverPhone });
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

    socket.on('disconnect', async () => {});
  });
};
