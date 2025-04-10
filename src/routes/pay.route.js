import { Router } from 'express';

import { getToken, createPay, preConfirmPay, confirmPay } from '../controllers/v1/pay.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.js';

const router = Router();

router.get('/auth', getToken);

router.post('/create', createPay);
router.post('/pre-confirm', preConfirmPay);
router.post('/confirm', confirmPay);

// router.put('/update/:id', payController.update);

export default router;
