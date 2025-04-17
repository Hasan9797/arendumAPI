import { Router } from 'express';

import bankCardController from '../controllers/v1/bankCard.controller.js';

import {
  authentication,
  authorization,
} from '../middlewares/auth.js';

import UserRole from '../enums/user/userRoleEnum.js';

const router = Router();

router.get('/', bankCardController.getAll);

router.get('/my-cards', authentication, bankCardController.getByUserId);

router.post('/card-init', authentication, bankCardController.cardInit);

router.post('/card-confirm', authentication, bankCardController.cardConfirm);

router.post('/card-cancel', authentication, bankCardController.cancelCard);

router.put('/update/:id', bankCardController.update);

router.delete('/delete/:id', bankCardController.distroy);

router.get('/:id', bankCardController.getById);

export default router;
