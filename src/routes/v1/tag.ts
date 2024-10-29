import { create } from 'controllers/tag';
import { destroy, destroyMultiple } from 'controllers/tag/destroy';
import { edit } from 'controllers/tag/edit';
import { list } from 'controllers/tag/list';
import { show } from 'controllers/tag/show';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorCreateTag } from 'middleware/validation/tag';
import { validatorEdit } from 'middleware/validation/tag/validatorEdit';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateTag], create);
router.post('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR']), validatorEdit], edit);
router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'])], destroy);
router.delete('/', [checkJwt, checkRole(['ADMINISTRATOR'])], destroyMultiple);

export default router;
