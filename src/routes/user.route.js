import { Router } from 'express';

const router = Router();

import userController from '../controllers/v1/user.controller.js';
import {
    authentication,
    authorization,
} from '../middlewares/auth.middleware.js';

// User routes

router.get('/', userController.getUsers);

router.get('/me', authentication, userController.getMe);

// bu route get method route lardan eng ohirida turishi kerak, sabab: /:id da route hatosi bo'lishi mumkun
router.get('/:id', userController.getUserById); 

router.post('/create', userController.createUser);

router.put('/update/:id', userController.updateUser);

router.delete('/delete/:id', userController.deleteUser);


export default router;
