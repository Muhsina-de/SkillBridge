import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// Load environment variables
config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'skillbridge_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    dialectOptions: {
      decimalNumbers: true,
    },
    logging: false // Disable logging in production
  }
);

export default sequelize;
