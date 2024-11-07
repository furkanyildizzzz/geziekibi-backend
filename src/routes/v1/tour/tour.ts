import { create, list } from 'controllers/tour/self';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import validatorCreateTour from 'middleware/validation/tour/self/validatorCreateTour';
import { uploadMiddleware } from 'middleware/multer';

const router = Router();

router.get('/', list);
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), uploadMiddleware, validatorCreateTour], create);

export default router;
