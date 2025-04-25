import { Router } from 'express';

import { test2 } from '../controllers/v1/test.controller.js';

const router = Router();

router.post('/', test2);

export default router;
