import { Review, ReviewFactory } from '../../models/review';
import { User, UserFactory } from '../../models/userprofile';
import { Session, SessionFactory } from '../../models/session';
import sequelize from '../../config/test-connection';

describe('Review Model', () => {
  let testMentee: User;
  let testMentor: User;
  let testSession: Session;

  /**
   * Create test users and session for review tests
   */
  const setupTestData = async () => {
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
  };

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
    await User.destroy({ where: {} });
    await Session.destroy({ where: {} });
    await setupTestData();
  });

  describe('Creation and Validation', () => {
    it('should create a valid review', async () => {
      const reviewData = {
        sessionId: testSession.id,
        menteeId: testMentee.id,
        mentorId: testMentor.id,
        rating: 5,
        comment: 'Great mentoring session!',
      };

      const review = await Review.create(reviewData);

      expect(review.sessionId).toBe(testSession.id);
      expect(review.menteeId).toBe(testMentee.id);
      expect(review.mentorId).toBe(testMentor.id);
      expect(review.rating).toBe(5);
      expect(review.comment).toBe('Great mentoring session!');
    });

    it('should fail when creating a review without required fields', async () => {
      const invalidReview = {
        sessionId: testSession.id,
        // Missing menteeId and mentorId
        rating: 5,
        comment: 'Great session!'
      };

      await expect(Review.create(invalidReview as any)).rejects.toThrow();
    });

    it('should validate rating range', async () => {
      const invalidRatings = [-1, 0, 6, 10];

      for (const rating of invalidRatings) {
        await expect(Review.create({
          sessionId: testSession.id,
          menteeId: testMentee.id,
          mentorId: testMentor.id,
          rating,
          comment: 'Test review with invalid rating',
        })).rejects.toThrow();
      }
    });

    it('should validate comment length', async () => {
      const invalidComments = [
        '', // Empty
        'Too short', // Less than 10 characters
        'a'.repeat(1001) // More than 1000 characters
      ];

      for (const comment of invalidComments) {
        await expect(Review.create({
          sessionId: testSession.id,
          menteeId: testMentee.id,
          mentorId: testMentor.id,
          rating: 5,
          comment,
        })).rejects.toThrow();
      }
    });
  });

  describe('Hooks and Updates', () => {
    it('should update mentor rating after review creation', async () => {
      await Review.create({
        sessionId: testSession.id,
        menteeId: testMentee.id,
        mentorId: testMentor.id,
        rating: 5,
        comment: 'Excellent mentoring session, very helpful!',
      });

      const updatedMentor = await User.findByPk(testMentor.id);
      expect(updatedMentor?.rating).toBe(5.0);
    });

    it('should update mentor rating after multiple reviews', async () => {
      // Create another session for second review
      const secondSession = await Session.create({
        menteeId: testMentee.id,
        mentorId: testMentor.id,
        status: 'accepted',
        date: new Date(),
        time: '15:00',
        skill: 'JavaScript',
        price: 50,
        duration: 60,
        sessionNotes: '',
        message: 'Second test session'
      });

      // Create first review
      await Review.create({
        sessionId: testSession.id,
        menteeId: testMentee.id,
        mentorId: testMentor.id,
        rating: 5,
        comment: 'Excellent first session!',
      });

      // Create second review
      await Review.create({
        sessionId: secondSession.id,
        menteeId: testMentee.id,
        mentorId: testMentor.id,
        rating: 4,
        comment: 'Good second session, but room for improvement.',
      });

      const updatedMentor = await User.findByPk(testMentor.id);
      expect(updatedMentor?.rating).toBe(4.5);
    });

    it('should update mentor rating after review deletion', async () => {
      const review = await Review.create({
        sessionId: testSession.id,
        menteeId: testMentee.id,
        mentorId: testMentor.id,
        rating: 5,
        comment: 'Excellent session!',
      });

      // Verify initial rating
      let updatedMentor = await User.findByPk(testMentor.id);
      expect(updatedMentor?.rating).toBe(5.0);

      // Delete review and check rating update
      await review.destroy();
      updatedMentor = await User.findByPk(testMentor.id);
      expect(updatedMentor?.rating).toBe(0);
    });
  });
});