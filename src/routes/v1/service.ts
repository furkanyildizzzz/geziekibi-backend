import { list, show, create, edit, destroy } from 'controllers/service';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import validatorCreateService from 'middleware/validation/service/validatorCreateService';
import validatorEditService from 'middleware/validation/service/validatorEditService';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateService], create);
router.post('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR']), validatorEditService], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;
