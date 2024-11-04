import { Router } from 'express';
import { uploadFile } from '../../controllers/upload/uploadFile';
import { upload } from '../../middleware/fileUpload';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);

export default router;
