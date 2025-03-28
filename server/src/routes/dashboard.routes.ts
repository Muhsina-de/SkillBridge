import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getDashboardData);

export default router; 