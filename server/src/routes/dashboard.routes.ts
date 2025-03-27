import express from 'express';
import { getMentorDashboard, getMenteeDashboard } from '../controllers/dashboard.controller';
import { authenticateJWT } from '../middleware/authmiddleware';

const router = express.Router();

// Protected routes - require authentication
router.get('/mentor', authenticateJWT, getMentorDashboard);
router.get('/mentee', authenticateJWT, getMenteeDashboard);

export default router; 