import express from 'express';
import { updateProfile, changePassword } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.put('/', authenticateToken, updateProfile);
router.put('/password', authenticateToken, changePassword);

export default router;