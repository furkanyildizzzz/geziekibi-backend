import { Router } from 'express';
import { uploadFile } from '../../controllers/upload/uploadFile';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';

const router = Router();

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR'])], uploadFile);

export default router;
