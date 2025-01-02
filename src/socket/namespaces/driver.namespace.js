import redisClient from '../../config/redis.js';

// Redis kalitlari
const clientsKey = 'clients'; // Mijozlar { clientId: socketId }
const driversKey = 'drivers'; // Haydovchilar { driverId: socketId }

export default (io) => {
  const driverNamespace = io.of('/driver');

  // driverNamespace.use((socket, next) => {
  // const { userId, role } = socket.handshake.auth;

  //   if (!token || token !== 'your-valid-token') {
  //     return next(new Error('Authentication error'));
  //   }

  //   console.log('Token validated');
  //   next();
  // });

  driverNamespace.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinRoom', (orderId) => {
      socket.join(orderId);
      console.log(`User joined room: ${orderId}`);
    });

    socket.on('acceptOrder', async ({ orderId, driverId }) => {
        const driverSocketId = await redisClient.hget(driversKey, driverId);
        io.of('/client').to(orderId).emit('orderAccepted', driverSocketId);
    });

    socket.on('updateLocation', async ({ driverId, location }) => {
      io.of('/client').to(orderId).emit('driverLocation', location);
    });

    socket.on('completeOrder', async ({ orderId }) => {});

    socket.on('disconnect', async () => {});
  });
};
