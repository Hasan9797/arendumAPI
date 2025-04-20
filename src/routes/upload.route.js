import Router from 'express';
const router = Router();

import { uploadFile, deleteFile } from '../controllers/v1/upload.controller.js';
import { upload } from '../middlewares/fileUpload.js';

router.post('/', upload.single('img'), uploadFile);
router.post('/remove', deleteFile);

export default router;
