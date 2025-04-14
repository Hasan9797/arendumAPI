import { Router } from 'express';

import clientController from '../controllers/v1/client.controller.js';
import { authentication } from '../middlewares/auth.js';

const router = Router();

router.get('/', clientController.getAll);

router.get('/me', authentication, clientController.getMe);

router.get('/process-order', authentication, clientController.getProcessOrder);

router.post('/create', clientController.create);

router.put('/update/:id', clientController.update);

router.delete('/delete/:id', clientController.distroy);

router.get('/:id', clientController.getById);

export default router;
