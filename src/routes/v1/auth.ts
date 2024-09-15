import { Router } from 'express';

const router = Router();

router.post('/login');
router.post('/register');
router.post('/change-password');

export default router;
