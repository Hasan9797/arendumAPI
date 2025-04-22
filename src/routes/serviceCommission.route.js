import { Router } from 'express';

import serviceCommissionController from '../controllers/v1/serviceCommission.controller.js';
import {
    authentication,
    authorization,
} from '../middlewares/auth.js';

import UserRole from '../enums/user/userRoleEnum.js';

const router = Router();

router.get('/', authentication, serviceCommissionController.getAll);

router.get('/:id', authentication, serviceCommissionController.getById);

router.post('/create', authentication, serviceCommissionController.create);

router.put('/update/:id', authentication, serviceCommissionController.update);

router.delete('/delete/:id', authentication, serviceCommissionController.distroy);

export default router;
