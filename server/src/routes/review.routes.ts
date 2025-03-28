import express from 'express';
import { createReview, getMentorReviews, updateReview, deleteReview } from '../controllers/review.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/mentor/:mentorId', getMentorReviews);

// Protected routes
router.post('/', authenticateToken, createReview);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

export default router;