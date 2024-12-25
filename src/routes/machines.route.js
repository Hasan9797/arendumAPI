import { Router } from 'express';

import machinsController from '../controllers/admin/machines.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import { ROLES } from '../constants/user-role.constant.js';

const router = Router();

router.get('/', authentication, machinsController.getAll);

router.get('/by/:id', machinsController.getById);

router.post(
  '/add',
  authentication,
  authorization([1]),
  machinsController.create
);

router.put('/update/:id', machinsController.update);

router.delete('/delete/:id', machinsController.distroy);

export default router;
