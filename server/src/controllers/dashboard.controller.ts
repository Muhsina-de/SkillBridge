import { Request, Response } from 'express';
import { User } from '../models/user';
import { Session } from '../models/session';
import { Review } from '../models/review';
import { Op } from 'sequelize';
import { sequelize } from '../models';

export const getMentorDashboard = async (req: Request, res: Response) => {
  try {
    const mentorId = req.user?.id;

    // Get upcoming sessions
    const upcomingSessions = await Session.findAll({
      where: {
        mentorId,
        status: 'scheduled',
        startTime: {
          [Op.gt]: new Date()
        }
      },
      include: [
        {
          model: User,
          as: 'mentee',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['startTime', 'ASC']],
      limit: 5
    });

    // Get recent reviews
    const recentReviews = await Review.findAll({
      where: {
        mentor_id: mentorId
      },
      include: [
        {
          model: User,
          as: 'mentee',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get earnings data
    const earnings = await Session.findAll({
      where: {
        mentorId,
        status: 'completed'
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('startTime')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('startTime'))],
      order: [[sequelize.fn('DATE', sequelize.col('startTime')), 'DESC']],
      limit: 30
    });

    res.json({
      upcomingSessions,
      recentReviews,
      earnings
    });
  } catch (error) {
    console.error('Error fetching mentor dashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

export const getMenteeDashboard = async (req: Request, res: Response) => {
  try {
    const menteeId = req.user?.id;

    // Get upcoming sessions
    const upcomingSessions = await Session.findAll({
      where: {
        menteeId,
        status: 'scheduled',
        startTime: {
          [Op.gt]: new Date()
        }
      },
      include: [
        {
          model: User,
          as: 'mentor',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['startTime', 'ASC']],
      limit: 5
    });

    // Get favorite mentors (based on review count)
    const favoriteMentors = await Review.findAll({
      attributes: [
        'mentor_id',
        [sequelize.fn('COUNT', sequelize.col('Review.id')), 'reviewCount'],
        [sequelize.fn('AVG', sequelize.col('Review.rating')), 'averageRating']
      ],
      include: [{
        model: User,
        as: 'mentor',
        attributes: ['id', 'username', 'email']
      }],
      where: {
        mentee_id: menteeId
      },
      group: ['mentor_id', 'mentor.id', 'mentor.username', 'mentor.email'],
      order: [[sequelize.fn('COUNT', sequelize.col('Review.id')), 'DESC']],
      limit: 5
    });

    // Get pending reviews
    const pendingReviews = await Session.findAll({
      where: {
        menteeId,
        status: 'completed'
      },
      include: [
        {
          model: User,
          as: 'mentor',
          attributes: ['id', 'username']
        }
      ],
      limit: 5
    });

    // Get learning progress
    const learningProgress = await Session.findAll({
      where: {
        menteeId,
        status: 'completed'
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('startTime')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'sessionCount']
      ],
      group: [sequelize.fn('DATE', sequelize.col('startTime'))],
      order: [[sequelize.fn('DATE', sequelize.col('startTime')), 'DESC']],
      limit: 30
    });

    res.json({
      upcomingSessions,
      favoriteMentors,
      pendingReviews,
      learningProgress
    });
  } catch (error) {
    console.error('Error fetching mentee dashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
}; 