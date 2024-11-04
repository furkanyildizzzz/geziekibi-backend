import { Router } from 'express';
import tour from './tour';
import tourCategory from './tourCategory';
import service from './service';

const router = Router();

router.use('/', tour);
router.use('/category', tourCategory);
router.use('/service', service);

export default router;
