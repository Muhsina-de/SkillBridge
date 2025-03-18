import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  getComments,
  createComment
} from '../controllers/forum.controller';

const router = Router();

// Topic routes
router.get('/topics', getAllTopics);
router.get('/topics/:id', getTopicById);
router.post('/topics', auth, createTopic);
router.put('/topics/:id', auth, updateTopic);
router.delete('/topics/:id', auth, deleteTopic);

// Comment routes
router.get('/topics/:topicId/comments', getComments);
router.post('/topics/:topicId/comments', auth, createComment);

export default router;
