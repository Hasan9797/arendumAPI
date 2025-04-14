import { Router } from 'express';

import orderController from '../controllers/v1/order.controller.js';
import orderPauseController from '../controllers/v1/orderPause.controller.js';

import { authentication, authorization } from '../middlewares/auth.js';

import userRole from '../enums/user/userRoleEnum.js';

const router = Router();

const allowedRoles = [userRole.ADMIN, userRole.CLIENT, userRole.DRIVER];

router.get(
  '/',
  authentication,
  authorization(allowedRoles),
  orderController.getAll
);

router.get('/start-work', authentication, orderController.orderStartWork); // query params: order ID

router.get('/end-work', authentication, orderController.orderEndWork); // query params: order ID

router.get('/start-pause', authentication, orderPauseController.startPauseTime); // query params: order ID

router.get('/end-pause', authentication, orderPauseController.endPauseTime); // query params: order ID

router.get('/cancel-order', authentication, orderController.orderCancel); // query params: order ID

router.get(
  '/get-new-order',
  authentication,
  orderController.getNewOrderByDriverParams
); // Authentication required

router.post('/create', authentication, orderController.create);

router.put('/update/:id', authentication, orderController.update);

router.delete('/delete/:id', authentication, orderController.distroy);

router.get('/:id', authentication, orderController.getById);

export default router;
