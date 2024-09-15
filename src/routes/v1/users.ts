import { Router } from 'express';

const router = Router();

router.get('/');
router.get('/:id([0-9]+)');
router.patch('/:id([0-9]+)');
router.delete('/:id([0-9]+)');

export default router;
