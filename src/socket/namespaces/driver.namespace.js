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
      try {
        const stillExists = await redisSetHelper.isNotificationStopped(
          String(orderId)
        );
        console.log('Order accepted successfully');
        if (stillExists === true) {
          socket.emit('orderPicked', {
            success: false,
            message: 'Order has been accepted by another driver',
          });
          console.log('Order accepted');
          return;
        }

        socket.join(`order_room_${orderId}`);
        console.log('driver join room');
        
        await orderService.updateOrder(orderId, {
          driverId: parseInt(socket.userId),
          status: OrderStatus.ASSIGNED,
        });

        io.of('/client').to(`order_room_${orderId}`).emit('orderAccepted', {
          success: true,
          driverName,
          driverPhone,
        });

        socket.emit('acceptedOrder', {
          success: true,
          message: 'You accepted the order',
        });

        await redisSetHelper.stopNotificationForOrder(String(orderId));
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Dreiver Location Send
    socket.on('updateLocation', async ({ orderId, log, lat }) => {
      console.log('Send Location');
      io.of('/client')
        .to(`order_room_${orderId}`)
        .emit('driverLocation', { orderId, log, lat });
    });

    // Driver arrived to client
    socket.on('icame', async ({ orderId }) => {
      await orderService.updateOrder(orderId, {
        status: OrderStatus.ARRIVED,
      });
      console.log('driver arrived');
      
      io.of('/client').to(`order_room_${orderId}`).emit('driverArrived', {
        success: true,
        message: 'Driver arrived to client',
      });
    });

    socket.on('disconnect', async () => {});
  });
};
