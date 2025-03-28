import express from 'express';
import { signUp, login } from '../controllers/user.controller';

const router = express.Router();

router.post('/register', signUp);
router.post('/login', login);

export default router;