import { Router, Request, Response, NextFunction } from 'express';
import { Review, User, Session } from '../models';
import { authenticateJWT } from '../middleware/authmiddleware';
import { AuthRequest } from '../types/express';

const router = Router();

/**
 * Input validation middleware for review submission
 */
const validateReviewInput = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { session_id, mentor_id, rating, comment } = req.body;
  
  if (!session_id || !mentor_id || !rating || !comment) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      received: { session_id, mentor_id, rating, comment }
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ 
      error: 'Rating must be between 1 and 5',
      received: rating
    });
  }

  if (comment.length < 10 || comment.length > 1000) {
    return res.status(400).json({ 
      error: 'Comment must be between 10 and 1000 characters',
      received: comment.length
    });
  }

  next();
};

/**
 * Get reviews for a mentor
 * @route GET /mentor/:mentorId
 */
router.get('/mentor/:mentorId', async (req: AuthRequest, res: Response) => {
  try {
    const mentorId = parseInt(req.params.mentorId, 10);
    console.log('Fetching reviews for mentor:', mentorId);

    const reviews = await Review.findAll({
      where: { mentor_id: mentorId },
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    console.error('Detailed error in GET /mentor/:mentorId:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

/**
 * Get review by session ID
 * @route GET /session/:sessionId
 */
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const review = await Review.findOne({
      where: { session_id: req.params.sessionId },
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

/**
 * Get review summary for a mentor
 * @route GET /mentor/:mentorId/summary
 */
router.get('/mentor/:mentorId/summary', async (req: Request, res: Response) => {
  try {
    const mentorId = parseInt(req.params.mentorId, 10);
    const reviews = await Review.findAll({
      where: { mentor_id: mentorId },
      attributes: ['rating']
    });

    const summary = {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0
        ? Number((reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 0
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching review summary:', error);
    res.status(500).json({ error: 'Failed to fetch review summary' });
  }
});

/**
 * Submit a review
 * @route POST /
 */
router.post('/', authenticateJWT, validateReviewInput, async (req: AuthRequest, res: Response) => {
  try {
    const { session_id, mentor_id, rating, comment } = req.body;
    const mentee_id = req.user?.id;

    if (!mentee_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const review = await Review.create({
      session_id,
      mentee_id,
      mentor_id,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

/**
 * Update a review
 * @route PUT /:id
 */
router.put('/:id', authenticateJWT, validateReviewInput, async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.update({ rating, comment });

    const updatedReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

/**
 * Delete a review
 * @route DELETE /:id
 */
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;