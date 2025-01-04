import { Router } from 'express';

const router = Router();

import userController from '../controllers/v1/user.controller.js';

// User routes

router.get('/', userController.getUsers);

router.get('/:id', userController.getUserById);

router.post('/create', userController.createUser);

router.put('/update/:id', userController.updateUser);

router.delete('/delete/:id', userController.deleteUser);

export default router;
