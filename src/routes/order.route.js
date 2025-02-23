import { Router } from 'express';

import orderController from '../controllers/v1/order.controller.js';
import orderPauseController from '../controllers/v1/order-pause.controller.js';

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

router.get('/start-work', authentication, orderController.orderStartWork);

router.get('/end-work', authentication, orderController.orderEndWork);

router.get('/start-pause', authentication, orderPauseController.startPauseTime);

router.get('/end-pause', authentication, orderPauseController.endPauseTime);

router.post('/create', authentication, orderController.create);

router.put('/update/:id', authentication, orderController.update);

router.delete('/delete/:id', authentication, orderController.distroy);

router.get('/:id', authentication, orderController.getById);

export default router;
