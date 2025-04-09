import { Router } from 'express';

import machinePriceController from '../controllers/v1/machinePrice.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.js';

import UserRole from '../enums/user/userRoleEnum.js';

const router = Router();

router.get('/', machinePriceController.getAll);

router.get('/:id', machinePriceController.getById);

router.get('/by-machine/:id', machinePriceController.getByMachineId);

router.post('/create', machinePriceController.create);

router.put('/update/:id', machinePriceController.update);

router.delete('/delete/:id', machinePriceController.distroy);

export default router;
