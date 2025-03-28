import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'mentor' | 'mentee';
  skills?: string[];
  rating?: number;
  profilePicture?: string;
  bio?: string;
  availability?: string[];
  location?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'admin' | 'mentor' | 'mentee';
  public skills!: string[];
  public rating!: number;
  public profilePicture!: string;
  public bio!: string;
  public availability!: string[];
  public location!: string;
  public linkedin!: string;
  public github!: string;
  public twitter!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to check password
  async checkPassword(loginPw: string): Promise<boolean> {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'mentor', 'mentee'),
      defaultValue: 'user',
    },
    skills: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    availability: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    location: {
      type: DataTypes.STRING,
    },
    linkedin: {
      type: DataTypes.STRING,
    },
    github: {
      type: DataTypes.STRING,
    },
    twitter: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
