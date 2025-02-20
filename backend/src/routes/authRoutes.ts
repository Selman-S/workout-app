import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

// Route handler'ları RequestHandler olarak tip tanımlama
const registerHandler: RequestHandler = register;
const loginHandler: RequestHandler = login;
const getMeHandler: RequestHandler = getMe;

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/me', protect, getMeHandler);

export default router; 