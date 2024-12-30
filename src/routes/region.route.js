import { Router } from 'express';

import regionController from '../controllers/admin/region.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../constants/user-role.constant.js';

const router = Router();

router.get('/', regionController.getAll);

router.get('/:id', regionController.getById);

router.post('/create', regionController.create);

router.put('/update/:id', regionController.update);

router.delete('/delete/:id', regionController.distroy);

export default router;
