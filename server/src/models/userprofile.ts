import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import sequelize from '../config/connection';

interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    skills: string[];
    role: string;
    rating: number;
    profilePicture: string;
    bio: string;
    availability: string[];
    location: string;
    linkedin: string;
    github: string;
    twitter: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public skills!: string[];
    public role!: string;
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
}
export function UserFactory(sequelize: Sequelize): typeof User {
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
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        skills:{
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('mentor', 'mentee'),
            allowNull: false,
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
            type: DataTypes.ARRAY(DataTypes.STRING),
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
        }
    },
        {   

        timestamps: true,
        tableName: 'users',
        sequelize,
        }
    );

    return User;
}