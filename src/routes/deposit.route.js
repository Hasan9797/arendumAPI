import { Router } from 'express';

import depositController from '../controllers/v1/deposit.controller.js';
import { authentication } from '../middlewares/auth.js';

const router = Router();

router.get('/', depositController.getAll);

router.put('/replinshment', authentication, depositController.depositReplinshment);

// router.post('/withdraw', authentication, depositController.withdraw);

router.put('/update/:id', depositController.update);

router.get('/:id', depositController.getById);

export default router;
