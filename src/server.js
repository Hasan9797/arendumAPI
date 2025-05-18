import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import cors from 'cors';
import SocketService from './socket/index.js';
import { Server } from 'socket.io';
import errorHandler from './middlewares/errorHandler.js';
import { CustomError } from './Errors/customError.js';
import orderDriverSearchScheduler from './Jobs/orderDriverSearchScheduler.js';

dotenv.config();

const app = express();
app.use(cors());

// Socket.IO Server creation
const server = http.createServer(app);
const io = new Server(server);

// Namespace Socket IO
new SocketService(io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cron Jobs: Har 5 daqiqada bir marta ishga tushadi
cron.schedule('*/5 * * * *', async () => {
  console.log('📅 Cron ishga tushdi: orderDriverSearchScheduler');
  try {
    await orderDriverSearchScheduler();
  } catch (err) {
    console.error('❌ Cronda xatolik:', err);
  }
});

// Static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../uploads')));

// ROUTES
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import machinesRoute from './routes/machines.route.js';
import machinesParamsRoute from './routes/machinesParams.route.js';
import driverRoute from './routes/driver.route.js';
import clientRoute from './routes/client.route.js';
import paramsFilterRoute from './routes/paramsFilter.route.js';
import uploadRoute from './routes/upload.route.js';
import regionRoute from './routes/region.route.js';
import structureRoute from './routes/structure.route.js';
import machinePriceRoute from './routes/machinePrice.route.js';
import staticRoute from './routes/static.route.js';
import orderRoute from './routes/order.route.js';
import userBalanceRoute from './routes/userBalance.route.js';
import serviceCommissionRoute from './routes/serviceCommission.route.js';
import testRoute from './routes/test.route.js';

// PAYMENT ROUTES
import bankCardRoute from './routes/bankCard.route.js';
import depositRoute from './routes/deposit.route.js';

// File uploads route
app.use('/api/file-upload', uploadRoute);

// API routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/machines', machinesRoute);
app.use('/api/machines-params', machinesParamsRoute);
app.use('/api/driver', driverRoute);
app.use('/api/client', clientRoute);
app.use('/api/params-filter', paramsFilterRoute);
app.use('/api/region', regionRoute);
app.use('/api/structure', structureRoute);
app.use('/api/machine-price', machinePriceRoute);
app.use('/api/static', staticRoute);
app.use('/api/order', orderRoute);
app.use('/api/user-balance', userBalanceRoute);
app.use('/api/service-commission', serviceCommissionRoute);
app.use('/api/test', testRoute);

// PAYMENT API
app.use('/api/cards', bankCardRoute);
app.use('/api/deposit', depositRoute);

// 404 middleware
app.use((req, res, next) => {
  next(CustomError.notFoundError('API Route Not Found'));
});

// Global error handling middleware’ni qo‘shish
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
