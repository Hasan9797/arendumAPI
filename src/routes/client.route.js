import { Router } from 'express';

import clientController from '../controllers/v1/client.controller.js';
import { authentication } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', clientController.getAll);

router.get('/me', authentication, clientController.getMe);

router.get('/:id', clientController.getById);

router.post('/create', clientController.create);

router.put('/update/:id', clientController.update);

router.delete('/delete/:id', clientController.distroy);

export default router;
