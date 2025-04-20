import { Router } from 'express';

import userBalanceController from '../controllers/v1/userBalance.controller.js';
import { authentication } from '../middlewares/auth.js';

const router = Router();

router.get('/', userBalanceController.getAll);

router.put('/update/:id', userBalanceController.update);

router.get('/:id', userBalanceController.getById);

export default router;
