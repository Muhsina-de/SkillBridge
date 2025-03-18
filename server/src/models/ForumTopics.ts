    import { Model, DataTypes, Optional } from 'sequelize';
    import sequelize from '../config/connection';
    import { User } from './userprofile';
    import ForumComment from './ForumComments';

    interface ForumTopicAttributes {
      id: number;
      title: string;
      content: string;
      category: string;
      userId: number;
      createdAt: Date;
      updatedAt: Date;
    }

    interface ForumTopicCreationAttributes extends Optional<ForumTopicAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

    class ForumTopic extends Model<ForumTopicAttributes, ForumTopicCreationAttributes> implements ForumTopicAttributes {
      public id!: number;
      public title!: string;
      public content!: string;
      public category!: string;
      public userId!: number;
      public readonly createdAt!: Date;
      public readonly updatedAt!: Date;
    }

    ForumTopic.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        userId: {
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
        modelName: 'ForumTopic',
        tableName: 'forum_topic',
      }
    );

    

    export default ForumTopic;
