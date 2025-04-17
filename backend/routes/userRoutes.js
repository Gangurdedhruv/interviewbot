import express from 'express';
import { register, login } from '../controllers/userControllers.js';
import { requestPasswordReset, resetPassword } from '../controllers/PasswordResetCtrl.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;