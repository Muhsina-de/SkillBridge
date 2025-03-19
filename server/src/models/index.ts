import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
<<<<<<< HEAD
import { initUser } from './userprofile';
import { initSession } from './session';
import { initReview } from './review';

// Load environment variables
config();
=======
import { UserFactory } from './userprofile';
import { SessionFactory } from './session';
import { ReviewFactory } from './review';
import ForumTopic from './ForumTopics';
import ForumComment from './ForumComments';
// Load environment variablesconfig();
>>>>>>> origin/master

/**
 * Database configuration options
 */
const dbConfig = {
  name: process.env.DB_NAME || 'ravenest',
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

// Initialize models
const User = initUser(sequelize);
const Session = initSession(sequelize);
const Review = initReview(sequelize, User);

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