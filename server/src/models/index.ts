import { Sequelize } from 'sequelize';
import { sequelize } from '../config/connection';
import User from './user';
import { Session, initSession } from './session';
import { Review, initializeReview } from './review';
import ForumTopic from './ForumTopics';
import ForumComment from './ForumComments';
import { User as UserProfile, initUser } from './userprofile';

// Initialize models
const initializedSession = initSession(sequelize);
const initializedReview = initializeReview(sequelize);
const initializedUserProfile = initUser(sequelize);
ForumTopic.initialize(sequelize);
ForumComment.initialize(sequelize);

// Define associations
User.hasOne(initializedUserProfile, {
  foreignKey: 'userId',
  as: 'profile'
});

initializedUserProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(ForumTopic, {
  foreignKey: 'authorId',
  as: 'topics'
});

ForumTopic.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'Author'
});

ForumTopic.hasMany(ForumComment, {
  foreignKey: 'topicId',
  as: 'Comments'
});

ForumComment.belongsTo(ForumTopic, {
  foreignKey: 'topicId',
  as: 'Topic'
});

User.hasMany(ForumComment, {
  foreignKey: 'authorId',
  as: 'comments'
});

ForumComment.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'Author'
});

User.hasMany(initializedReview, {
  foreignKey: 'userId',
  as: 'reviews'
});

initializedReview.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

initializedUserProfile.hasMany(initializedReview, {
  foreignKey: 'profileId',
  as: 'reviews'
});

initializedReview.belongsTo(initializedUserProfile, {
  foreignKey: 'profileId',
  as: 'profile'
});

export {
  sequelize,
  User,
  initializedSession as Session,
  initializedReview as Review,
  ForumTopic,
  ForumComment,
  initializedUserProfile as UserProfile
};