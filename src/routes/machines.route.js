import { Router } from 'express';

import machinesController from '../controllers/v1/machines.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.js';

import UserRole from '../enums/user/userRoleEnum.js';

const router = Router();

router.get('/', machinesController.getAll);

router.get('/:id', machinesController.getById);

router.post('/create', machinesController.create);

router.put('/update/:id', machinesController.update);

router.delete('/delete/:id', machinesController.distroy);

export default router;
