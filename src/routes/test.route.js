import { Router } from 'express';

import { test } from '../controllers/v1/test.controller.js';

const router = Router();

router.post('/firebase-test', test);

export default router;
