import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http'; // HTTP serverni yaratish uchun
import cors from 'cors';
import socketServer from './socket/index.js'; // Socket.IO serverni ulash

dotenv.config();

const app = express();
const server = http.createServer(app); // HTTP server
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../uploads')));

// Routes
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import machinesRoute from './routes/machines.route.js';
import machinesParamsRoute from './routes/machines-params.route.js';
import driverRoute from './routes/driver.route.js';
import clientRoute from './routes/client.route.js';
import paramsFilterRoute from './routes/params-filter.route.js';
import uploadRoute from './routes/upload.route.js';
import regionRoute from './routes/region.route.js';
import structureRoute from './routes/structure.route.js';
import machinePriceRoute from './routes/machine-price.route.js';
import staticRoute from './routes/static.route.js';

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

// Initialize Socket.IO server
socketServer(server);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
