import { Router } from 'express';
import tour from './tour';
import tourCategory from './tourCategory';

const router = Router();

router.use('/', tour);
router.use('/category', tourCategory);

export default router;
