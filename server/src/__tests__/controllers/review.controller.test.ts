import request from 'supertest';
import { app } from '../setup';
import { Review, ReviewFactory } from '../../models/review';
import { User, UserFactory } from '../../models/userprofile';
import { Session, SessionFactory } from '../../models/session';
import sequelize from '../../config/test-connection';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import {
  createReview,
  getReviewsByMentor,
  getReviewsBySession,
  updateReview,
  deleteReview
} from '../../controllers/review.controller';

// Mock the models
jest.mock('../../models/review');
jest.mock('../../models/session');
jest.mock('../../models/user');

describe('Review Controller', () => {
  let testMentee: any;
  let testMentor: any;
  let testSession: any;
  let authToken: string;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAuthRequest: any;
  let responseObject = {};

  beforeAll(async () => {
    // Initialize models using factories
    UserFactory(sequelize);
    SessionFactory(sequelize);
    ReviewFactory(sequelize);

    // Set up associations
    User.hasMany(Session, { foreignKey: 'menteeId', as: 'menteeSessions' });
    User.hasMany(Session, { foreignKey: 'mentorId', as: 'mentorSessions' });
    Session.belongsTo(User, { foreignKey: 'menteeId', as: 'mentee' });
    Session.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });
    Session.hasOne(Review);
    Review.belongsTo(Session);
    Review.belongsTo(User, { foreignKey: 'menteeId', as: 'mentee' });
    Review.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Review.destroy({ where: {} });
    await Session.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create test users
    testMentee = await User.create({
      username: 'testmentee',
      email: 'mentee@test.com',
      password: 'password123',
      role: 'mentee',
      skills: [],
      rating: 0,
      profilePicture: '',
      bio: '',
      availability: [],
      location: '',
      linkedin: '',
      github: '',
      twitter: ''
    });

    testMentor = await User.create({
      username: 'testmentor',
      email: 'mentor@test.com',
      password: 'password123',
      role: 'mentor',
      skills: ['JavaScript'],
      rating: 0,
      profilePicture: '',
      bio: '',
      availability: [],
      location: '',
      linkedin: '',
      github: '',
      twitter: ''
    });

    // Create test session
    testSession = await Session.create({
      menteeId: testMentee.id,
      mentorId: testMentor.id,
      status: 'accepted',
      date: new Date(),
      time: '14:00',
      skill: 'JavaScript',
      price: 50,
      duration: 60,
      sessionNotes: '',
      message: 'Test session'
    });

    // Create auth token for testMentee with numeric ID
    authToken = jwt.sign(
      { id: Number(testMentee.id), email: testMentee.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    mockRequest = {
      body: {
        sessionId: testSession.id,
        menteeId: testMentee.id,
        mentorId: testMentor.id,
        rating: 5,
        comment: "Excellent session! Very helpful and informative."
      }
    };

    responseObject = {
      statusCode: 0,
      json: null
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      })
    };

    // Reset all mocks
    jest.clearAllMocks();

    // Setup authenticated request mock
    mockAuthRequest = {
      ...mockRequest,
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };
  });

  describe('POST /api/reviews (createReview)', () => {
    const validReviewData = {
      sessionId: 1,
      menteeId: 1,
      mentorId: 2,
      rating: 5,
      comment: 'Great session!'
    };

    it('should create a review successfully', async () => {
      const mockSession = {
        id: 1,
        menteeId: '1',
        mentorId: '2'
      };

      const mockReview = {
        id: 1,
        ...validReviewData
      };

      // Mock Session.findByPk
      (Session.findByPk as jest.Mock).mockResolvedValue(mockSession);
      // Mock Review.create
      (Review.create as jest.Mock).mockResolvedValue(mockReview);

      mockAuthRequest.body = validReviewData;

      await createReview(mockAuthRequest as Request, mockResponse as Response);

      expect(Session.findByPk).toHaveBeenCalledWith(validReviewData.sessionId);
      expect(Review.create).toHaveBeenCalledWith({
        ...validReviewData,
        isVerified: true
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockReview);
    });

    it('should return 404 if session not found', async () => {
      (Session.findByPk as jest.Mock).mockResolvedValue(null);

      mockAuthRequest.body = validReviewData;

      await createReview(mockAuthRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Session not found' });
    });

    it('should return 403 if user not authorized', async () => {
      const mockSession = {
        id: 1,
        menteeId: '2', // Different from authenticated user
        mentorId: '3'
      };

      (Session.findByPk as jest.Mock).mockResolvedValue(mockSession);

      mockAuthRequest.body = validReviewData;

      await createReview(mockAuthRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Not authorized to review this session' 
      });
    });
  });

  describe('GET /api/reviews/mentor/:mentorId', () => {
    it('should fetch reviews for a mentor successfully', async () => {
      const mockReviews = [
        { id: 1, rating: 5, comment: 'Great!' },
        { id: 2, rating: 4, comment: 'Good!' }
      ];

      (Review.findAll as jest.Mock).mockResolvedValue(mockReviews);

      mockRequest.params = { mentorId: '1' };

      await getReviewsByMentor(mockRequest as Request, mockResponse as Response);

      expect(Review.findAll).toHaveBeenCalledWith({
        where: { mentorId: '1' },
        order: [['createdAt', 'DESC']]
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should handle errors when fetching mentor reviews', async () => {
      (Review.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      mockRequest.params = { mentorId: '1' };

      await getReviewsByMentor(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error fetching reviews',
        error: expect.any(Error)
      });
    });
  });

  describe('GET /api/reviews/session/:sessionId', () => {
    it('should fetch review for a session successfully', async () => {
      const mockReview = { id: 1, rating: 5, comment: 'Great!' };

      (Review.findOne as jest.Mock).mockResolvedValue(mockReview);

      mockRequest.params = { sessionId: '1' };

      await getReviewsBySession(mockRequest as Request, mockResponse as Response);

      expect(Review.findOne).toHaveBeenCalledWith({
        where: { sessionId: '1' }
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockReview);
    });

    it('should return 404 if review not found', async () => {
      (Review.findOne as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { sessionId: '1' };

      await getReviewsBySession(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });
  });

  describe('PUT /api/reviews/:id', () => {
    const updateData = {
      rating: 4,
      comment: 'Updated comment'
    };

    it('should update a review successfully', async () => {
      const mockReview = {
        id: 1,
        menteeId: '1',
        update: jest.fn().mockResolvedValue({ id: 1, ...updateData })
      };

      (Review.findByPk as jest.Mock).mockResolvedValue(mockReview);

      mockAuthRequest.params = { id: '1' };
      mockAuthRequest.body = updateData;

      await updateReview(mockAuthRequest as Request, mockResponse as Response);

      expect(Review.findByPk).toHaveBeenCalledWith('1');
      expect(mockReview.update).toHaveBeenCalledWith(updateData);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1, ...updateData });
    });

    it('should return 404 if review not found', async () => {
      (Review.findByPk as jest.Mock).mockResolvedValue(null);

      mockAuthRequest.params = { id: '1' };
      mockAuthRequest.body = updateData;

      await updateReview(mockAuthRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });

    it('should return 403 if user not authorized', async () => {
      const mockReview = {
        id: 1,
        menteeId: '2' // Different from authenticated user
      };

      (Review.findByPk as jest.Mock).mockResolvedValue(mockReview);

      mockAuthRequest.params = { id: '1' };
      mockAuthRequest.body = updateData;

      await updateReview(mockAuthRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Not authorized to update this review' 
      });
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    it('should delete a review successfully', async () => {
      const mockReview = {
        id: 1,
        menteeId: '1',
        destroy: jest.fn().mockResolvedValue(undefined)
      };

      (Review.findByPk as jest.Mock).mockResolvedValue(mockReview);

      mockAuthRequest.params = { id: '1' };

      await deleteReview(mockAuthRequest as Request, mockResponse as Response);

      expect(Review.findByPk).toHaveBeenCalledWith('1');
      expect(mockReview.destroy).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 404 if review not found', async () => {
      (Review.findByPk as jest.Mock).mockResolvedValue(null);

      mockAuthRequest.params = { id: '1' };

      await deleteReview(mockAuthRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Review not found' });
    });

    it('should return 403 if user not authorized', async () => {
      const mockReview = {
        id: 1,
        menteeId: '2' // Different from authenticated user
      };

      (Review.findByPk as jest.Mock).mockResolvedValue(mockReview);

      mockAuthRequest.params = { id: '1' };

      await deleteReview(mockAuthRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Not authorized to delete this review' 
      });
    });
  });
}); 