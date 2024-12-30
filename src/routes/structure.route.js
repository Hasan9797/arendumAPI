import { Router } from 'express';

import structureController from '../controllers/admin/structure.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../constants/user-role.constant.js';

const router = Router();

router.get('/', structureController.getAll);

router.get('/:id', structureController.getById);

router.post('/create', structureController.create);

router.put('/update/:id', structureController.update);

router.delete('/delete/:id', structureController.distroy);

export default router;
