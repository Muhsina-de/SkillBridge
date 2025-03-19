import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import { UserFactory } from './userprofile';
import { SessionFactory } from './session';
import { ReviewFactory } from './review';
import ForumTopic from './ForumTopics';
import ForumComment from './ForumComments';
// Load environment variablesconfig();

/**
 * Database configuration options
 */
const dbConfig = {
  name: process.env.DB_NAME || 'skillbridge_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'SNH123!@im',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres' as const,
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
};

/**
 * Initialize Sequelize instance with database configuration
 */
const sequelize = new Sequelize(
  dbConfig.name,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

/**
 * Initialize models using their respective factories
 */
const User = UserFactory(sequelize);
const Session = SessionFactory(sequelize);
const Review = ReviewFactory(sequelize);

/**
 * Define User-Session associations
 * - A user can have many sessions as mentee
 * - A user can have many sessions as mentor
 * - A session belongs to a user as mentee
 * - A session belongs to a user as mentor
 */
User.hasMany(Session, { foreignKey: 'menteeId', as: 'menteeSessions' });
User.hasMany(Session, { foreignKey: 'mentorId', as: 'mentorSessions' });
Session.belongsTo(User, { foreignKey: 'menteeId', as: 'mentee' });
Session.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });

/**
 * Define User-Review and Session-Review associations
 * - A user can have many reviews as mentee
 * - A user can have many reviews as mentor
 * - A review belongs to a user as mentee
 * - A review belongs to a user as mentor
 * - A review belongs to a session
 * - A session can have one review
 */
User.hasMany(Review, { foreignKey: 'menteeId', as: 'menteeReviews' });
User.hasMany(Review, { foreignKey: 'mentorId', as: 'mentorReviews' });
Review.belongsTo(User, { foreignKey: 'menteeId', as: 'mentee' });
Review.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });
Review.belongsTo(Session, { foreignKey: 'sessionId' });
Session.hasOne(Review, { foreignKey: 'sessionId' });



User.hasMany(ForumTopic, { foreignKey: 'userId' });
ForumTopic.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ForumComment, { foreignKey: 'userId' });
ForumComment.belongsTo(User, { foreignKey: 'userId' });

ForumTopic.hasMany(ForumComment, { foreignKey: 'Id' });
ForumComment.belongsTo(ForumTopic, { foreignKey: 'Id' });


// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit if we can't connect to the database
  });

export { sequelize, User, Session, Review, ForumTopic, ForumComment };