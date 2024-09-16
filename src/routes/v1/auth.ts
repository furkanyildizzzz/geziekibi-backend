import { login, register } from 'controllers/auth';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { validatorChangePassword, validatorLogin, validatorRegister } from 'middleware/validation/auth';

const router = Router();

router.post('/login', [validatorLogin], login);
router.post('/register', [validatorRegister], register);
router.post('/change-password', [checkJwt, validatorChangePassword]);

export default router;
