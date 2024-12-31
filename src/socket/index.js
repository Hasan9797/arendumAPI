import { Server } from 'socket.io';
import redisClient from '../config/redis.js';

// Redis kalitlari
const clientsKey = 'clients'; // Mijozlar { clientId: socketId }
const driversKey = 'drivers'; // Haydovchilar { driverId: socketId }

// Socket.IO serverni yaratish
const socketServer = (httpServer) => {
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // **1. Tizimga ulanish**
    socket.on('join', async ({ userId, role }) => {
      if (role === 'client') {
        // Mijozni Redis’da saqlash
        await redisClient.hSet(clientsKey, userId, socket.id);
        console.log(`Client ${userId} connected`);
      } else if (role === 'driver') {
        // Haydovchini Redis’da saqlash
        await redisClient.hSet(driversKey, userId, socket.id);
        console.log(`Driver ${userId} connected`);
      }

      // Barcha foydalanuvchilarga xabar yuborish
      io.emit('userStatus', { userId, role, status: 'online' });
    });

    // **2. Tizimdan uzilish**
    socket.on('disconnect', async () => {
      console.log(`Socket disconnect: ${socket.id}`);

      // Mijozni o‘chirish
      const clients = await redisClient.hGetAll(clientsKey);
      for (const [userId, socketId] of Object.entries(clients)) {
        if (socketId === socket.id) {
          await redisClient.hDel(clientsKey, userId);
          io.emit('userStatus', { userId, role: 'client', status: 'offline' });
          console.log(`Client ${userId} disconnected`);
        }
      }

      // Haydovchini o‘chirish
      const drivers = await redisClient.hGetAll(driversKey);
      for (const [userId, socketId] of Object.entries(drivers)) {
        if (socketId === socket.id) {
          await redisClient.hDel(driversKey, userId);
          io.emit('userStatus', { userId, role: 'driver', status: 'offline' });
          console.log(`Driver ${userId} disconnected`);
        }
      }
    });

    // **3. Buyurtma yaratish**
    socket.on('createOrder', async ({ clientId, region, pickup, dropoff }) => {
      const orderId = `order_${Date.now()}`; // Unique order ID yaratish
      const order = {
        orderId,
        clientId,
        region,
        pickup,
        dropoff,
        status: 'PENDING',
      };

      // Buyurtmani Redis’da saqlash
      await redisClient.hSet(`order:${orderId}`, order);

      // Haydovchilarga xabar yuborish
      const drivers = await redisClient.hGetAll(driversKey);
      for (const [driverId, socketId] of Object.entries(drivers)) {
        if (await isDriverInRegion(driverId, region)) {
          io.to(socketId).emit('newOrder', { ...order });
        }
      }

      console.log(`Order ${orderId} created and notified to drivers`);
    });

    // **4. Buyurtmani qabul qilish**
    socket.on('acceptOrder', async ({ orderId, driverId }) => {
      const order = await redisClient.hGetAll(`order:${orderId}`);
      if (order && order.status === 'PENDING') {
        // Buyurtma statusini yangilash
        order.status = 'ACCEPTED';
        order.driverId = driverId;
        await redisClient.hSet(`order:${orderId}`, order);

        // Mijozga xabar yuborish
        const clientSocketId = await redisClient.hGet(
          clientsKey,
          order.clientId
        );
        if (clientSocketId) {
          io.to(clientSocketId).emit('orderAccepted', { ...order });
        }

        console.log(`Order ${orderId} accepted by driver ${driverId}`);
      }
    });

    // **5. Haydovchi joylashuvini yangilash**
    socket.on('updateLocation', async ({ driverId, location }) => {
      const orders = await redisClient.keys('order:*');
      for (const orderKey of orders) {
        const order = await redisClient.hGetAll(orderKey);
        if (order.driverId === driverId && order.status === 'ACCEPTED') {
          // Mijozga haydovchining joylashuvini yuborish
          const clientSocketId = await redisClient.hGet(
            clientsKey,
            order.clientId
          );
          if (clientSocketId) {
            io.to(clientSocketId).emit('driverLocation', location);
          }
        }
      }
    });

    // **6. Buyurtmani yakunlash**
    socket.on('completeOrder', async ({ orderId }) => {
      const order = await redisClient.hGetAll(`order:${orderId}`);
      if (order && order.status === 'ACCEPTED') {
        // Buyurtma statusini yangilash
        order.status = 'COMPLETED';
        await redisClient.hSet(`order:${orderId}`, order);

        // Mijozga xabar yuborish
        const clientSocketId = await redisClient.hGet(
          clientsKey,
          order.clientId
        );
        if (clientSocketId) {
          io.to(clientSocketId).emit('orderCompleted', { orderId });
        }

        console.log(`Order ${orderId} completed`);
      }
    });
  });

  return io;
};

// Haydovchini hudud bo‘yicha tekshirish (Mock funksiyasi)
const isDriverInRegion = async (driverId, region) => {
  // Bu funksiyani ma'lumotlar bazasidan yoki Redis orqali implementatsiya qiling
  return true;
};

export default socketServer;
