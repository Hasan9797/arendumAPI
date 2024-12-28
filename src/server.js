import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import machinesRoute from './routes/machines.route.js';
import machinesParamsRoute from './routes/machines-params.route.js';
import driverRoute from './routes/driver.route.js';
import clientRoute from './routes/client.route.js';
import paramsFilterRoute from './routes/params-filter.route.js';

//Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/machines', machinesRoute);
app.use('/api/machines-params', machinesParamsRoute);
app.use('/api/driver', driverRoute);
app.use('/api/client', clientRoute);
app.use('/api/params-filter', paramsFilterRoute);
// app.use('/api/deposit',);
// app.use('/api/payment',);
// app.use('/api/region',);
// app.use('/api/structure',);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
