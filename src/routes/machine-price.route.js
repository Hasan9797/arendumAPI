import { Router } from 'express';

import machinePriceController from '../controllers/v1/machine-price.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../enums/user/user-role.enum.js';

const router = Router();

router.get('/', machinePriceController.getAll);

router.get('/:id', machinePriceController.getById);

router.post('/create', machinePriceController.create);

router.put('/update/:id', machinePriceController.update);

router.delete('/delete/:id', machinePriceController.distroy);

export default router;
