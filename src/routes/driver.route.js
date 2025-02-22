import { Router } from 'express';
import driverController from '../controllers/v1/driver.controller.js';

import {
    authentication,
    authorization,
} from '../middlewares/auth.middleware.js';

const router = Router();

// User routes

router.get('/', driverController.getAll);

router.get('/me', authentication, driverController.getMe);

router.get('/:id', driverController.getById);

router.post('/create', driverController.create);

router.put('/update/:id', driverController.update);

router.delete('/delete/:id', driverController.distroy);

export default router;
