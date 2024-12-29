import { Router } from 'express';

import {
  authentication,
  authorization,
} from '../middlewares/auth.middleware.js';

import UserRole from '../constants/user-role.constant.js';
import paramsFiltersController from '../controllers/admin/params-filters.controller.js';

const router = Router();

router.get('/', paramsFiltersController.getAll);

router.get('/:id', paramsFiltersController.getById);

router.post('/create', paramsFiltersController.create);

router.put('/update/:id', paramsFiltersController.update);

router.delete('/delete/:id', paramsFiltersController.distroy);

export default router;
