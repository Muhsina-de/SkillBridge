import { Sequelize } from 'sequelize';
import config from '../config/database';
import UserModel from './user';
import ProfileModel from './profile';
import TopicModel from './topic';
import CommentModel from './comment';
import CategoryModel from './category';
import ReviewModel from './review';

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  logging: false,
});

// Define associations
UserModel.hasOne(ProfileModel, {
  foreignKey: 'userId',
  as: 'profile'
});

ProfileModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user'
});

UserModel.hasMany(TopicModel, {
  foreignKey: 'userId',
  as: 'topics'
});

TopicModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user'
});

CategoryModel.hasMany(TopicModel, {
  foreignKey: 'categoryId',
  as: 'topics'
});

TopicModel.belongsTo(CategoryModel, {
  foreignKey: 'categoryId',
  as: 'category'
});

TopicModel.hasMany(CommentModel, {
  foreignKey: 'topicId',
  as: 'comments'
});

CommentModel.belongsTo(TopicModel, {
  foreignKey: 'topicId',
  as: 'topic'
});

UserModel.hasMany(CommentModel, {
  foreignKey: 'userId',
  as: 'comments'
});

CommentModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user'
});

UserModel.hasMany(ReviewModel, {
  foreignKey: 'userId',
  as: 'reviews'
});

ReviewModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user'
});

ProfileModel.hasMany(ReviewModel, {
  foreignKey: 'profileId',
  as: 'reviews'
});

ReviewModel.belongsTo(ProfileModel, {
  foreignKey: 'profileId',
  as: 'profile'
});

export {
  sequelize,
  UserModel,
  ProfileModel,
  TopicModel,
  CommentModel,
  CategoryModel,
  ReviewModel
};