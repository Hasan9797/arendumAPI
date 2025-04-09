import { Router } from 'express';

import machinParamsController from '../controllers/v1/machineParams.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.js';

import UserRole from '../enums/user/userRoleEnum.js';

const router = Router();

router.get('/', machinParamsController.getAll);

router.get('/get-by-machine-id', machinParamsController.getMachineParamsByMachineId);

router.post('/create', machinParamsController.create);

router.put('/update/:id', machinParamsController.update);

router.get(
  '/select-params-options',
  machinParamsController.getSelectParamsOptions
);

router.get(
  '/filter-params-options',
  machinParamsController.getMachineParamsOptions
);

router.delete('/delete/:id', machinParamsController.distroy);

router.get('/:id', machinParamsController.getById);

export default router;
