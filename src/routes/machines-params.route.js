import { Router } from 'express';

import machinParamsController from '../controllers/v1/machine-params.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../enums/user/user-role.enum.js';

const router = Router();

router.get('/', authentication, machinParamsController.getAll);

router.get('/:id', machinParamsController.getById);

router.post('/by-machine', machinParamsController.getMachineParamsByMachineId);

router.post('/create', authentication, machinParamsController.create);

router.put('/update/:id', machinParamsController.update);

router.post('/select-options', machinParamsController.getSelectParams);

router.post('/filter-options', machinParamsController.getMachineOprions);

router.delete('/delete/:id', machinParamsController.distroy);

export default router;
