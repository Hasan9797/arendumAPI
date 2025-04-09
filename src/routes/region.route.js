import { Router } from 'express';

import regionController from '../controllers/v1/region.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.js';

import UserRole from '../enums/user/userRoleEnum.js';

const router = Router();

router.get('/', regionController.getAll);

router.post('/create', regionController.create);

router.put('/update/:id', regionController.update);

router.delete('/delete/:id', regionController.distroy);

router.get('/get-static', regionController.getRegionStatic);

router.get('/:id', regionController.getById);

export default router;
