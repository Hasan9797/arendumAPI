import { sendNotification } from '../../helpers/sendNotificationHelper.js';
import driverService from '../../services/driver.service.js';
import { verifyToken } from '../../helpers/jwtTokenHelper.js';
import redisSetHelper from '../../helpers/redisSetHelper.js';
import orderService from '../../services/order.service.js';
import { OrderStatus } from '../../enums/order/orderStatusEnum.js';

class ClientSocketHandler {
  constructor(io) {
    this.io = io;
    this.driverNamespace = io.of('/driver');
    this.clientNamespace = io.of('/client');
    this.clientNamespace.use(this.authMiddleware.bind(this));
    this.clientNamespace.on('connection', this.onConnection.bind(this));
  }

  // Authentication middleware
  authMiddleware(socket, next) {
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
      console.log('Client Socket error message:', error.message);
      socket.emit('error', { message: error.message });
    }
  }

  // Connection event
  async onConnection(socket) {
    try {
      console.log('Client connected:', socket.id);

      socket.on('joinRoom', ({ orderId }) => {
        socket.join(`order_room_${orderId}`);
        console.log(`Client joined room: order_room_${orderId}`);
        socket.emit('inRoom', { success: true, orderId });
      });

      socket.on('createOrder', async (order) => {
        if (!order || typeof order.id !== 'number') {
          throw new Error('orderId is required');
        }

        socket.orderId = order.id;

        await orderService.updateOrder(order.id, {
          status: OrderStatus.SEARCHING,
        });

        socket.join(`order_room_${order.id}`);

        const drivers = await driverService.getDriversInClientStructure(
          order.structure.id,
          order.machineId,
          order.params,
          order.type,
          order.amountType
        );

        if (drivers.length === 0) {
          socket.emit('driverNotFound', { message: 'Driver not found' });
          return;
        }

        const title = 'New Order';
        const body = 'You have a new order';
        const data = {
          key: 'new_order',
          order: JSON.stringify(order),
        };

        await redisSetHelper.startNotificationForOrder(String(order.id));

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

        const finalCheck = await redisSetHelper.isNotificationStopped(
          String(order.id)
        );

        if (finalCheck === false) {
          socket.emit('driverWaiting', {
            success: false,
            message: 'No driver accepted the order',
          });
        }
      });

      socket.on('disconnect', async () => {
        console.log('Client disconnected');
      });
    } catch (error) {
      console.log(error);
      socket.emit('error', { message: error.message });
    }
  }

  static sendOrderPauseToClient(orderId) {
    this.clientNamespace.to(`order_room_${orderId}`).emit('orderPaused', {
      success: true,
      message: 'Order paused',
    });
  }
}

export default ClientSocketHandler;
