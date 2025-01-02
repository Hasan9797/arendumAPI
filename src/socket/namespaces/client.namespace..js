import redisClient from '../../config/redis.js';

// Redis kalitlari
const clientsKey = 'clients'; // Mijozlar { clientId: socketId }
const driversKey = 'drivers'; // Haydovchilar { driverId: socketId }

export default (io) => {
  const clientNamespace = io.of('/client');

  // clientNamespace.use((socket, next) => {
  // const { userId, role } = socket.handshake.auth;

  //   if (!token || token !== 'your-valid-token') {
  //     return next(new Error('Authentication error'));
  //   }

  //   console.log('Token validated');
  //   next();
  // });

  clientNamespace.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', async ({ userId, role }) => {});

    socket.on('createOrder', async ({ clientId, region }) => {
      const driverSocketId = await redisClient.hget(driversKey, driverId);
      io.of('/driver').to(driverSocketId).emit('newOrder', order);
    });

    socket.on('disconnect', async () => {});
  });
};
