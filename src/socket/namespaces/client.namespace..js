import orderRepository from '../../repositories/order.repo.js';
import driverService from '../../services/driver.service.js';

export default (io) => {
  const clientNamespace = io.of('/client');

  clientNamespace.use((socket, next) => {
    const { userId, token, role, orderId } = socket.handshake.auth;

    if (!token || token !== process.env.CLIENT_SOCKET_SECRET_KEY) {
      return next(new Error('Authentication error'));
    }

    if (orderId) {
      socket.join(`order_room_${orderId}`);
      console.log(`Socket ${socket.id} joined room ${orderId}`);
    }

    console.log('Token validated');
    next();
  });

  clientNamespace.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', async ({ userId, role }) => {
      // Additional join logic
    });

    socket.on('createOrder', async ({ orderId, clientId, long, lat }) => {
      socket.join(`order_room_${orderId}`);
      await driverService.sendNotificationToDriver(clientId);
      socket.emit('searchingDriver', { success: true });
    });

    socket.on('disconnect', async () => {});
  });
};
