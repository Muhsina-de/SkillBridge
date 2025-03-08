import { Request, Response } from 'express';
import { Review } from '../models/review';
import { Session } from '../models/session';

interface AuthRequest extends Request {
  user?: {
    id: string | number;
    email: string;
  };
}

// Create a new review
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, menteeId, mentorId, rating, comment } = req.body;

    // Verify session ownership
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.menteeId.toString() !== req.user?.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this session' });
    }

    const review = await Review.create({
      sessionId,
      menteeId,
      mentorId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};

// Get reviews by mentor ID
export const getReviewsByMentor = async (req: Request, res: Response) => {
  try {
    const { mentorId } = req.params;
    const reviews = await Review.findAll({
      where: { mentorId },
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

// Get review by session ID
export const getReviewsBySession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const review = await Review.findOne({
      where: { sessionId }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review', error });
  }
};

// Update a review
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.menteeId.toString() !== req.user?.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    await review.update({ rating, comment });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
};

// Delete a review
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.menteeId.toString() !== req.user?.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
}; 