import { config } from 'dotenv';
import { User, UserFactory } from '../models/userprofile';
import { Session, SessionFactory } from '../models/session';
import { Review, ReviewFactory } from '../models/review';
import sequelize from '../config/test-connection';
import { createServer } from '../server';
import { Server } from 'http';

// Load environment variables
config();

// Set test environment
process.env.NODE_ENV = 'test';

// Create Express app instance
export const app = createServer();

// Server instance
let server: Server;

// Increase test timeout
jest.setTimeout(30000);

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

  // Start server for tests
  server = app.listen(0);
});

afterAll(async () => {
  // Close server
  if (server) {
    await new Promise((resolve) => server.close(() => resolve(undefined)));
  }
  // Close database connection
  await sequelize.close();
}); 