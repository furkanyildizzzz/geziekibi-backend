import { Router } from 'express';
import { uploadFile } from '../../controllers/upload/uploadFile';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { uploadMiddleware } from 'middleware/multer';

const router = Router();

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), uploadMiddleware], uploadFile);

export default router;
