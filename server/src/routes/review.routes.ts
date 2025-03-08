import { Router, Request, Response, NextFunction } from 'express';
import { Review, User, Session } from '../models';

const router = Router();

/**
 * Input validation middleware for review submission
 */
const validateReviewInput = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { sessionId, menteeId, mentorId, rating, comment } = req.body;
  
  if (!sessionId || !menteeId || !mentorId || !rating || !comment) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      received: { sessionId, menteeId, mentorId, rating, comment }
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
router.get('/mentor/:mentorId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.findAll({
      where: { mentorId: req.params.mentorId },
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
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
      where: { sessionId: req.params.sessionId },
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
    const reviews = await Review.findAll({
      where: { mentorId: req.params.mentorId },
      attributes: ['rating']
    });

    const summary = {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
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
router.post('/', validateReviewInput, async (req: Request, res: Response) => {
  try {
    console.log('Received review submission:', req.body);
    
    const { sessionId, menteeId, mentorId, rating, comment } = req.body;

    // Verify the session exists and belongs to these users
    const session = await Session.findOne({
      where: {
        id: sessionId,
        menteeId,
        mentorId,
        status: 'accepted' // Only allow reviews for completed sessions
      }
    });

    console.log('Found session:', session);

    if (!session) {
      return res.status(403).json({ 
        error: 'Session not found or not eligible for review',
        sessionId,
        menteeId,
        mentorId
      });
    }

    // Check if a review already exists for this session
    const existingReview = await Review.findOne({
      where: { sessionId }
    });

    console.log('Existing review check:', existingReview);

    if (existingReview) {
      return res.status(400).json({ error: 'A review already exists for this session' });
    }

    console.log('Creating review with data:', {
      sessionId,
      menteeId,
      mentorId,
      rating,
      comment
    });

    const review = await Review.create({
      sessionId,
      menteeId,
      mentorId,
      rating,
      comment
    });

    console.log('Review created successfully:', review);

    // Fetch the complete review with mentee information
    const completeReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'mentee',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    res.status(201).json(completeReview);
  } catch (error) {
    console.error('Error in review submission:', error);
    res.status(500).json({ 
      error: 'Failed to process review submission',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update a review
 * @route PUT /:id
 */
router.put('/:id', validateReviewInput, async (req: Request, res: Response) => {
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
router.delete('/:id', async (req: Request, res: Response) => {
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