import { Router } from 'express';

import clientController from '../controllers/clients/client.controller.js';
import { authentication } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', clientController.getAll);

router.get('/show/:id', clientController.getAll);

router.post('/add', clientController.create);

router.post('/update/:id', clientController.update);

router.delete('/delete/:id', clientController.distroy);

export default router;
