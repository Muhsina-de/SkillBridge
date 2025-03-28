import express from 'express';
import { getTopics, createTopic, getTopicById, createComment } from '../controllers/forum.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getTopics);
router.get('/:id', getTopicById);

// Protected routes
router.post('/', authenticateToken, createTopic);
router.post('/:id/comments', authenticateToken, createComment);

export default router;
