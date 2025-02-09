import { Router } from 'express';

import regionController from '../controllers/v1/region.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../enums/user/user-role.enum.js';

const router = Router();

router.get('/', regionController.getAll);

router.get('/:id', regionController.getById);

router.post('/create', regionController.create);

router.put('/update/:id', regionController.update);

router.delete('/delete/:id', regionController.distroy);

router.get('/get-region-static', regionController.getRegionStatic);

export default router;
