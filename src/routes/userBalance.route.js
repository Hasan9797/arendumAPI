import { Router } from 'express';

import userBalanceController from '../controllers/v1/userBalance.controller.js';
import { authentication } from '../middlewares/auth.js';

const router = Router();

router.get('/', userBalanceController.getAll);

router.get('/get-driver-balance', userBalanceController.getByDriverId); // query params: driver ID
router.get('/get-client-balance', userBalanceController.getByClientId); // query params: client ID
router.put('/update-by-user-id', userBalanceController.updateByUserId);

router.put('/update/:id', userBalanceController.update);

router.get('/:id', userBalanceController.getById);

export default router;
