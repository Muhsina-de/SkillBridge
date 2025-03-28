import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface SessionAttributes {
    id: number;
    menteeId: number;
    mentorId: number;
    status: string;
    startTime: Date;
    endTime: Date;
    notes: string;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}

export class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    public id!: number;
    public menteeId!: number;
    public mentorId!: number;
    public status!: string;
    public startTime!: Date;
    public endTime!: Date;
    public notes!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function initSession(sequelize: Sequelize): typeof Session {
    Session.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            menteeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            mentorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
                defaultValue: 'scheduled',
            },
            startTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            modelName: 'Session',
            tableName: 'sessions',
            timestamps: true,
        }
    );

    return Session;
}
