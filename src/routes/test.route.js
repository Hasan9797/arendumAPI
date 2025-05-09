import { Router } from 'express';

import { test2, sendSmsRequest } from '../controllers/v1/test.controller.js';

const router = Router();

router.post('/', test2);
router.get('/send-sms', sendSmsRequest);

export default router;
