import { Router } from 'express';

import machinParamsController from '../controllers/admin/machine-params.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../constants/user-role.constant.js';

const router = Router();

router.get('/', authentication, machinParamsController.getAll);

router.get('/:id', machinParamsController.getById);

router.post('/create', authentication, machinParamsController.create);

router.put('/update/:id', machinParamsController.update);

router.delete('/delete/:id', machinParamsController.distroy);

export default router;
