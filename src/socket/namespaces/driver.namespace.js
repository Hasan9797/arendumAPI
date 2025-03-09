import { OrderStatus } from '../../enums/order/order-status.enum.js';
import redisSetHelper from '../../helpers/redis-set-helper.js';
import orderService from '../../services/order.service.js';
import { verifyToken } from '../../helpers/jwt-token.helper.js';

class DriverSocketHandler {
  static io = null; // static methodlar uchun

  constructor(io) {
    this.io = io; // Obyekt metodlari uchun
    DriverSocketHandler.io = io; // Static methodlar uchun ham saqlash

    this.driverNamespace = io.of('/driver');

    this.authMiddleware = this.authMiddleware.bind(this);
    this.onConnection = this.onConnection.bind(this);

    this.driverNamespace.use(this.authMiddleware);
    this.driverNamespace.on('connection', this.onConnection);
  }

  // Static metodda `io` ni to‘g‘ri o‘rnatish
  static init(io) {
    if (!this.io) {
      this.io = io;
    }
  }

  // Connection event
  async onConnection(socket) {
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

        DriverSocketHandler.io
          .of('/client')
          .to(`order_room_${orderId}`)
          .emit('orderAccepted', {
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

    socket.on('updateLocation', async ({ orderId, log, lat }) => {
      DriverSocketHandler.io
        .of('/client')
        .to(`order_room_${orderId}`)
        .emit('driverLocation', { orderId, log, lat });
    });

    socket.on('icame', async ({ orderId }) => {
      await orderService.updateOrder(orderId, {
        status: OrderStatus.ARRIVED,
      });

      DriverSocketHandler.io
        .of('/client')
        .to(`order_room_${orderId}`)
        .emit('driverArrived', {
          success: true,
          message: 'Driver arrived to client',
        });
    });

    socket.on('disconnect', async () => {
      console.log(`Driver ${socket.id} disconnected`);
    });
  }

  static sendOrderAcceptedToClient(orderId, driverName, driverPhone) {
    if (!DriverSocketHandler.io) {
      console.error('❌ Error: Socket.IO not initialized');
      throw new Error('Socket.IO not initialized');
    }

    DriverSocketHandler.io
      .of('/client')
      .to(`order_room_${orderId}`)
      .emit('orderAccepted', {
        success: true,
        driverName,
        driverPhone,
      });
  }
}

export default DriverSocketHandler;
