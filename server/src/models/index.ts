import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import { initUser } from './userprofile';
import { initSession } from './session';
import { initReview } from './review';
import ForumTopic from './ForumTopics';
import ForumComment from './ForumComments';

// Load environment variables
config();

/**
 * Initialize Sequelize instance with database configuration
 */
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  dialectOptions: {
    decimalNumbers: true,
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
});

// Initialize models
const User = initUser(sequelize);
const Session = initSession(sequelize);
const Review = initReview(sequelize, User);

// Initialize forum models
ForumTopic.initialize(sequelize);
ForumComment.initialize(sequelize);

// Define associations
User.hasMany(Session, {
  foreignKey: 'menteeId',
  as: 'menteeSessions',
  onDelete: 'CASCADE'
});

User.hasMany(Session, {
  foreignKey: 'mentorId',
  as: 'mentorSessions',
  onDelete: 'CASCADE'
});

Session.belongsTo(User, {
  foreignKey: 'menteeId',
  as: 'mentee'
});

Session.belongsTo(User, {
  foreignKey: 'mentorId',
  as: 'mentor'
});

User.hasMany(Review, {
  foreignKey: 'menteeId',
  as: 'givenReviews',
  onDelete: 'CASCADE'
});

User.hasMany(Review, {
  foreignKey: 'mentorId',
  as: 'receivedReviews',
  onDelete: 'CASCADE'
});

Review.belongsTo(User, {
  foreignKey: 'menteeId', 
  as: 'mentee'
});

Review.belongsTo(User, {
  foreignKey: 'mentorId',
  as: 'mentor'
});

Review.belongsTo(Session, {
  foreignKey: 'sessionId'
});

Session.hasOne(Review, {
  foreignKey: 'sessionId',
  onDelete: 'CASCADE'
});

// Forum associations
ForumTopic.associate({ User, ForumComment });
ForumComment.associate({ User, ForumTopic });
User.hasMany(ForumTopic, { foreignKey: 'userId' });
User.hasMany(ForumComment, { foreignKey: 'userId' });

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