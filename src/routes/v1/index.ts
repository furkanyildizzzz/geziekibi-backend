import { Router } from 'express';

import auth from './auth';
import users from './users';
import tour from './tour';
import tag from './tag';
import upload from './upload';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/tour', tour);
router.use('/tag', tag);
router.use('/upload', upload);

export default router;
