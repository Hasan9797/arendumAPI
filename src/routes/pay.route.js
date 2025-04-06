import { Router } from 'express';

import payController from '../controllers/v1/pay.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/auth', payController.getToken);

router.post('/card-init', payController.cardInit);
router.post('/card-confirm', payController.cardConfirm);

// router.put('/update/:id', payController.update);

export default router;
