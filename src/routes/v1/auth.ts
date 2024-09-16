import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { validatorChangePassword, validatorLogin, validatorRegister } from 'middleware/validation/auth';

const router = Router();

router.post('/login', [validatorLogin]);
router.post('/register', [validatorRegister]);
router.post('/change-password', [checkJwt, validatorChangePassword]);

export default router;
