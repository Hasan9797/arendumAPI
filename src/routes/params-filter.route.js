import { Router } from 'express';

import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../enums/user/user-role.enum.js';
import paramsFiltersController from '../controllers/v1/params-filters.controller.js';

const router = Router();

router.get('/', paramsFiltersController.getAll);

router.get('/:id', paramsFiltersController.getById);

router.post('/create', paramsFiltersController.create);

router.put('/update/:id', paramsFiltersController.update);

router.delete('/delete/:id', paramsFiltersController.distroy);

export default router;
