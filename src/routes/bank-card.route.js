import { Router } from 'express';

import bankCardController from '../controllers/v1/bank-card.controller.js';

import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../enums/user/user-role.enum.js';

const router = Router();

router.get('/', bankCardController.getAll);

router.post('/create', bankCardController.create);

router.put('/update/:id', bankCardController.update);

router.delete('/delete/:id', bankCardController.distroy);

router.get('/:id', bankCardController.getById);

export default router;
