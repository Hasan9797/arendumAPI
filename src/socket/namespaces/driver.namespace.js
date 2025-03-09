import { OrderStatus } from '../../enums/order/order-status.enum.js';
import redisSetHelper from '../../helpers/redis-set-helper.js';
import orderService from '../../services/order.service.js';
import { verifyToken } from '../../helpers/jwt-token.helper.js';
import userRoleEnum from '../../enums/user/user-role.enum.js';

class DriverSocketHandler {
  constructor(io) {
    this.io = io;
    this.driverNamespace = io.of('/driver');
    this.clientNamespace = io.of('/client');
    this.driverNamespace.use(this.authMiddleware.bind(this));
    this.driverNamespace.on('connection', this.onConnection.bind(this));
  }

  // Authentication middleware
  authMiddleware(socket, next) {
    try {
      const token = socket.handshake.headers['auth'];
      if (!token) return next(new Error('Access denied, no token provided'));

      const user = verifyToken(token);
      if (!user) return next(new Error('User error'));

      if (user.role !== userRoleEnum.DRIVER)
        return next(new Error('Role error')); // Qo‘shildi

      socket.userId = user.id;
      socket.role = user.role;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Connection event
  async onConnection(socket) {
    console.log(`Socket connected: ${socket.id}`);

    // Driver room'ga qo'shilishi
    socket.on('joinRoom', (orderId) => {
      socket.join(`order_room_${orderId}`);
      socket.emit('orderStatus', { status: true, orderId });
    });

    // Buyurtmani qabul qilish
    socket.on('acceptOrder', async ({ orderId, driverName, driverPhone }) => {
      try {
        const stillExists = await redisSetHelper.isNotificationStopped(
          String(orderId)
        );

        console.log('Redis Set:', stillExists);

        if (stillExists === true) {
          socket.emit('orderPicked', {
            success: false,
            message: 'Order has been accepted by another driver',
          });
          return;
        }

        socket.join(`order_room_${orderId}`);

        await orderService.updateOrder(orderId, {
          driverId: parseInt(socket.userId),
          status: OrderStatus.ASSIGNED,
        });

        this.clientNamespace.to(`order_room_${orderId}`).emit('orderAccepted', {
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

    // Driver lokatsiyasini yuborish
    socket.on('updateLocation', async ({ orderId, log, lat }) => {
      this.clientNamespace
        .to(`order_room_${orderId}`)
        .emit('driverLocation', { orderId, log, lat });
    });

    // Driver mijozga yetib kelgani haqida xabar yuborish
    socket.on('icame', async ({ orderId }) => {
      await orderService.updateOrder(orderId, {
        status: OrderStatus.ARRIVED,
      });

      this.clientNamespace.to(`order_room_${orderId}`).emit('driverArrived', {
        success: true,
        message: 'Driver arrived to client',
      });
    });

    // Ulanish uzilganda
    socket.on('disconnect', async () => {
      console.log(`Driver ${socket.id} disconnected`);
    });
  }

  sendOrderAcceptedToClient(orderId, driverName, driverPhone) {
    this.clientNamespace.to(`order_room_${orderId}`).emit('orderAccepted', {
      success: true,
      driverName,
      driverPhone,
    });
  }
}

export default DriverSocketHandler;
