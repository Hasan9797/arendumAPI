import { Router } from 'express';

import machinsController from '../controllers/admin/machines.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../constants/user-role.constant.js';

const router = Router();

router.get('/', authentication, machinsController.getAll);

router.get('/:id', machinsController.getById);

router.post('/create', machinsController.create);

router.put('/update/:id', machinsController.update);

router.delete('/delete/:id', machinsController.distroy);

export default router;
