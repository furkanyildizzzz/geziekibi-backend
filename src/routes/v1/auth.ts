import { login, register } from 'controllers/auth';
import { changePassword } from 'controllers/auth/changePassword';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { validatorChangePassword, validatorLogin, validatorRegister } from 'middleware/validation/auth';

const router = Router();

router.post('/login', [validatorLogin], login);
router.post('/register', [validatorRegister], register);
router.post('/change-password', [checkJwt, validatorChangePassword], changePassword);

export default router;
