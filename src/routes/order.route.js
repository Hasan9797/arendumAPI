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

router.get('/:id', orderController.getById);

router.post('/create', orderController.create);

router.put('/update/:id', orderController.update);

router.delete('/delete/:id', orderController.distroy);

export default router;
