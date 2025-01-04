import Router from 'express';
const router = Router();

import { uploadFile } from '../controllers/v1/upload.controller.js';
import { upload } from '../middlewares/file-upload.middleware.js';

router.post('/', upload.single('img'), uploadFile);

export default router;
