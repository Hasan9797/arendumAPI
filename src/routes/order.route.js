import { Router } from 'express';

import orderController from '../controllers/v1/order.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import userRole from '../enums/user/user-role.enum.js';

const router = Router();

const allowedRoles = [userRole.ADMIN, userRole.CLIENT, userRole.DRIVER];

router.get(
  '/',
  authentication,
  authorization(allowedRoles),
  orderController.getAll
);

router.get('/update-hour-time', authentication, orderController.updateOrderStartAndEndTime);

router.post('/create', authentication, orderController.create);

router.put('/update/:id', authentication, orderController.update);

router.delete('/delete/:id', authentication, orderController.distroy);

router.get('/:id', authentication, orderController.getById);

export default router;
