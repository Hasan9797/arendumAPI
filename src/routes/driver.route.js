import { Router } from 'express';
import driverController from '../controllers/v1/driver.controller.js';

import { authentication, authorization } from '../middlewares/auth.js';

const router = Router();

// User routes

router.get('/', driverController.getAll);

router.get('/me', authentication, driverController.getMe);

router.get('/process-order', authentication, driverController.getProcessOrder);

router.get('/accept-order', authentication, driverController.acceptOrder); // query params: order ID

router.get('/driver-came', driverController.driverCame); // query params: order ID

router.get('/cancel-order', authentication, driverController.cancelOrder); // query params: order ID

router.put('/is-online', authentication, driverController.setOnline);

router.get('/get-planned-orders', authentication, driverController.getPlannedOrders); // auth required

router.get('/:id', driverController.getById);

router.post('/create', driverController.create);

router.put('/profile-update', authentication, driverController.profileUpdate);

router.put('/update/:id', driverController.update);

router.delete('/delete/:id', driverController.distroy);

export default router;
