import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/connection';
import { User } from './userprofile';

interface ForumCommentAttributes {
  id: number;
  content: string;
  userId: number;
  topicId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ForumCommentCreationAttributes extends Optional<ForumCommentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ForumComment extends Model<ForumCommentAttributes, ForumCommentCreationAttributes> implements ForumCommentAttributes {
  public id!: number;
  public content!: string;
  public userId!: number;
  public topicId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ForumComment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ForumComment',
    tableName: 'forum_comments',
  }
);



export default ForumComment;