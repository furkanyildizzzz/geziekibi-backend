import { Router } from 'express';

import auth from './auth';
import users from './users';
import tour from './tour';
import tag from './tag';
import service from './service';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/tour', tour);
router.use('/tag', tag);
router.use('/service', service);

export default router;
