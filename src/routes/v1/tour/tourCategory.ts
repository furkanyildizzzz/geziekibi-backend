import { list, show, create, edit, destroy } from 'controllers/tour/category';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import validatorCreateTourCategory from 'middleware/validation/tour/category/validatorCreateTourCategory';
import validatorEditTourCategory from 'middleware/validation/tour/category/validatorEditTourCategory';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateTourCategory], create);
router.post('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR']), validatorEditTourCategory], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);

export default router;
