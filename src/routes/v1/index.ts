import { Router } from 'express';

import auth from './auth';
import users from './users';
import tour from './tour';
import tag from './tag';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/tour', tour);
router.use('/tag', tag);

export default router;
