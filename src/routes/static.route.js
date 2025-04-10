import { Router } from 'express';

import staticController from '../controllers/v1/statics.controller.js';

import {
  authentication,
  authorization,
} from '../middlewares/auth.js';

const router = Router();

router.get('/users/options', staticController.userOptions);

router.get('/driver/status', staticController.driverStatus);

router.get('/client/status', staticController.clientStatus);

router.get('/order/status', staticController.orderStatus);

router.get('/order/amount-type', staticController.orderAmountType);

router.put('/machine/status', staticController.machineStatus);

router.get('/region/ids', staticController.getRegionIds);

router.get('/structure/ids', staticController.getStructureIds);


export default router;
