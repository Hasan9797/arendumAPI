import { OrderStatus } from '../../enums/order/orderStatusEnum.js';
import redisSetHelper from '../../helpers/redisSetHelper.js';
import orderService from '../../services/order.service.js';
import { verifyToken } from '../../helpers/jwtTokenHelper.js';
import userRoleEnum from '../../enums/user/userRoleEnum.js';

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
      // const machineId = socket.handshake.headers['machineid'];
      // const regionId = socket.handshake.headers['regionid'];

      if (!token) return next(new Error('Access denied, no token provided'));

      const user = verifyToken(token);
      if (!user) return next(new Error('User error'));

      if (user.role !== userRoleEnum.DRIVER)
        return next(new Error('Role error'));

      // ❗ Check for required headers
      // if (!machineId || !regionId) {
      //   return next(new Error('Missing machineId or regionId in headers'));
      // }

      socket.userId = user.id;
      socket.role = user.role;
      // socket.machineId = String(machineId);
      // socket.regionId = String(regionId);

      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }


  // Connection event
  async onConnection(socket) {
    console.log(`Socket connected: ${socket.id}`);
    socket.join(`drivers_room_${socket.role}`);

    // Driver room'ga qo'shilishi
    socket.on('joinRoom', (orderId) => {
      socket.join(`order_room_${orderId}`);
      socket.emit('inRoom', { success: true, orderId });
    });

    // Buyurtmani qabul qilish
    socket.on('acceptOrder', async ({ orderId, driverName, driverPhone }) => {
      try {
        const stillExists = await redisSetHelper.isNotificationStopped(
          String(orderId)
        );

        // console.log('Redis Set:', stillExists);

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
