import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { User } from './userprofile';
import sequelize from '../config/connection';

/**
 * Interface representing a Review's attributes
 */
interface ReviewAttributes {
  id: number;
  sessionId: number;
  menteeId: number;
  mentorId: number;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface for Review creation attributes
 * Excludes id as it's auto-generated
 */
interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

/**
 * Review model class
 * Represents a review given by a mentee to a mentor for a specific session
 */
export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public sessionId!: number;
  public menteeId!: number;
  public mentorId!: number;
  public rating!: number;
  public comment!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Updates the mentor's average rating based on all their reviews
   * @param mentorId - ID of the mentor to update
   * @throws Error if the update fails
   */
  public static async updateMentorRating(mentorId: number): Promise<void> {
    try {
      const reviews = await Review.findAll({
        where: { mentorId }
      });
      
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      
      await User.update(
        { rating: Number(averageRating.toFixed(1)) },
        { where: { id: mentorId } }
      );
    } catch (error) {
      console.error('Error updating mentor rating:', error);
      throw new Error('Failed to update mentor rating');
    }
  }
}

/**
 * Factory function to initialize the Review model
 * @param sequelize - Sequelize instance
 * @returns Review model
 */
export function ReviewFactory(sequelize: Sequelize): typeof Review {
  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'sessions',
          key: 'id',
        },
      },
      menteeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      mentorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [10, 1000], // Minimum 10 characters, maximum 1000
        },
      },
    },
    {
      sequelize,
      tableName: 'reviews',
      timestamps: true,
      hooks: {
        afterCreate: async (review: Review) => {
          await Review.updateMentorRating(review.mentorId);
        },
        afterUpdate: async (review: Review) => {
          await Review.updateMentorRating(review.mentorId);
        },
        afterDestroy: async (review: Review) => {
          await Review.updateMentorRating(review.mentorId);
        }
      }
    }
  );

  return Review;
} 