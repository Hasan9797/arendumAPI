import { sendNotification } from '../../helpers/send-notification.helper.js';
import driverService from '../../services/driver.service.js';
import { verifyToken } from '../../helpers/jwt-token.helper.js';
import redisSetHelper from '../../helpers/redis-set-helper.js';
import orderService from '../../services/order.service.js';
import { OrderStatus } from '../../enums/order/order-status.enum.js';

class ClientSocketHandler {
  constructor(io) {
    this.io = io;
    this.clientNamespace = io.of('/client');

    this.authMiddleware = this.authMiddleware.bind(this);
    this.onConnection = this.onConnection.bind(this);
    this.clientNamespace.use(this.authMiddleware);

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
      console.log(error);
      socket.emit('error', { message: error.message });
    }
  }

  // Connection event
  async onConnection(socket) {
    try {
      console.log('Client connected:', socket.id);

      socket.on('joinRoom', (orderId) => {
        socket.join(`order_room_${orderId}`);
        socket.emit('orderStatus', { status: true, orderId });
      });

      socket.on(
        'createOrder',
        async ({ orderId, orderType, amountType, structureId, params }) => {
          if (!orderId || typeof orderId !== 'number') {
            throw new Error('orderId is required');
          }

          socket.orderId = orderId;

          await orderService.updateOrder(orderId, {
            status: OrderStatus.SEARCHING,
          });

          socket.join(`order_room_${orderId}`);

          const drivers = await driverService.getDriversInClientStructure(
            structureId,
            params,
            orderType,
            amountType
          );

          if (drivers.length === 0) {
            socket.emit('driverNotFound', { message: 'Driver not found' });
            return;
          }

          const title = 'New Order';
          const body = 'You have a new order';
          const data = {
            key: 'new_order',
            orderId: String(orderId),
          };

          await redisSetHelper.startNotificationForOrder(String(orderId));

          for (const driver of drivers) {
            const orderExists = await redisSetHelper.isNotificationStopped(
              String(orderId)
            );

            if (orderExists === true) break;

            await sendNotification(driver?.fcmToken, title, body, data);

            await new Promise((resolve) => setTimeout(resolve, 5000));

            const stillExists = await redisSetHelper.isNotificationStopped(
              String(orderId)
            );

            if (stillExists === true) break;
          }

          const finalCheck = await redisSetHelper.isNotificationStopped(
            String(orderId)
          );

          if (finalCheck === false) {
            socket.emit('driverWaiting', {
              success: false,
              message: 'No driver accepted the order',
            });
          }
        }
      );

      socket.on('disconnect', async () => {
        if (socket.orderId) {
          this.io.to(`order_room_${socket.orderId}`).emit('orderAccepted', {
            success: false,
            message:
              'The client has disconnected. If they need to rejoin an active room, use joinRoom to reconnect!',
          });
        } else {
          console.log('Client disconnected');
        }
      });
    } catch (error) {
      console.log(error);
      socket.emit('error', { message: error.message });
    }
  }

  static sendOrderPauseToClient(orderId) {
    this.io.of('/client').to(`order_room_${orderId}`).emit('orderPaused', {
      success: true,
      message: 'Order paused',
    });
  }
}

export default ClientSocketHandler;
