import { Router } from 'express';

import machinParamsController from '../controllers/v1/machine-params.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../enums/user/user-role.enum.js';

const router = Router();

router.get('/', machinParamsController.getAll);

router.get('/:id', machinParamsController.getById);

router.post('/by-machine', machinParamsController.getMachineParamsByMachineId);

router.post('/create', machinParamsController.create);

router.put('/update/:id', machinParamsController.update);

router.post('/select-params-options', machinParamsController.getSelectParamsOptions);

router.post('/filter-params-options', machinParamsController.getMachineParamsOptions);

router.delete('/delete/:id', machinParamsController.distroy);

export default router;
