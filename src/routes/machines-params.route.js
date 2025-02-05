import { Router } from 'express';

import machinParamsController from '../controllers/v1/machine-params.controller.js';
import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../enums/user/user-role.enum.js';

const router = Router();

router.get('/', machinParamsController.getAll);


router.post('/by-machine', machinParamsController.getMachineParamsByMachineId);

router.get('/:id', machinParamsController.getById);

router.post('/create', machinParamsController.create);

router.put('/update/:id', machinParamsController.update);

router.get('/select-params-options/:id', machinParamsController.getSelectParamsOptions);

router.get('/filter-params-options/:id', machinParamsController.getMachineParamsOptions);

router.delete('/delete/:id', machinParamsController.distroy);

export default router;
