import { Router } from 'express';

import clientController from '../controllers/clients/client.controller.js';
import { authentication } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', clientController.getAll);

router.get('/:id', clientController.getById);

router.post('/create', clientController.create);

router.put('/update/:id', clientController.update);

router.delete('/delete/:id', clientController.distroy);

// router.get('/static', );

export default router;
