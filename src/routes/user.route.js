import { Router } from 'express';

const router = Router();

import userController from '../controllers/admin/user.controller.js';

// User routes

router.get('/', userController.getUsers);

router.post('/add', userController.createUser);

export default router;
