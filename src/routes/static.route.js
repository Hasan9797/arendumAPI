import { Router } from 'express';

import staticController from '../controllers/v1/statics.controller.js';

import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/driver', staticController.driverOptions);

router.get('/client', staticController.clientOptions);

router.post('/order', staticController.orderOptions);

router.put('/machine', staticController.machineOptions);

// router.delete('/delete/:id', staticController.distroy);

export default router;
