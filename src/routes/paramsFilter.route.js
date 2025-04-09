import { Router } from 'express';

import {
  authentication,
  authorization,
} from '../middlewares/auth.js';

import UserRole from '../enums/user/userRoleEnum.js';
import paramsFiltersController from '../controllers/v1/paramsFilters.controller.js';

const router = Router();

router.get('/', paramsFiltersController.getAll);

router.get('/:id', paramsFiltersController.getById);

router.get('/by-machine/:id', paramsFiltersController.getByMachineId);

router.post('/create', paramsFiltersController.create);

router.put('/update/:id', paramsFiltersController.update);

router.delete('/delete/:id', paramsFiltersController.distroy);

export default router;
