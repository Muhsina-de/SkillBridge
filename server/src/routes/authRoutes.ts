import { Router, Request, Response } from 'express';
import { signUp, login } from '../controllers/user.controller';


const router = Router();

router.post('/signup', signUp);
router.post('/login', login);

export default router;