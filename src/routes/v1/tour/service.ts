import { list, show, create, edit, destroy, destroyMultiple } from 'controllers/tour/service';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import validatorCreateService from 'middleware/validation/tour/service/validatorCreateService';
import validatorEditService from 'middleware/validation/tour/service/validatorEditService';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateService], create);
router.post('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR']), validatorEditService], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);
router.delete('/', [checkJwt, checkRole(['ADMINISTRATOR'])], destroyMultiple);

export default router;
