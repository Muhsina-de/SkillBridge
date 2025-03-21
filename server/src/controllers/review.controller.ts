import { Response } from 'express';
import { Review } from '../models/review';
import { AuthRequest } from '../types/express';

// Create a new review
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment, session_id, mentor_id } = req.body;
    
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const review = await Review.create({
      rating,
      comment,
      session_id,
      mentor_id,
      mentee_id: req.user.id
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
};

// Get reviews by mentor ID
export const getMentorReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { mentor_id } = req.params;
    
    const reviews = await Review.findAll({
      where: { mentor_id: parseInt(mentor_id, 10) },
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching mentor reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Get review by session ID
export const getSessionReview = async (req: AuthRequest, res: Response) => {
  try {
    const { session_id } = req.params;
    
    const review = await Review.findOne({
      where: { session_id: parseInt(session_id, 10) }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error fetching session review:', error);
    res.status(500).json({ message: 'Error fetching review' });
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

    // Check if the user is the owner of the review
    if (!req.user?.id || review.mentee_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    await review.update({ rating, comment });

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review' });
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

    // Check if the user is the owner of the review
    if (!req.user?.id || review.mentee_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.destroy();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
}; 