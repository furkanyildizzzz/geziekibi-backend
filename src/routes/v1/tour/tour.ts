import { create, destroy, list, show } from 'controllers/tour/self';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import validatorCreateTour from 'middleware/validation/tour/self/validatorCreateTour';
import { uploadMiddleware } from 'middleware/multer';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), uploadMiddleware, validatorCreateTour], create);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;
