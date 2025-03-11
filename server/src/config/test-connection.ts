import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

const testSequelize = new Sequelize(
  process.env.DB_NAME || 'skillbridge_test',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    dialectOptions: {
      decimalNumbers: true,
    },
    logging: false // Disable logging during tests
  }
);

export default testSequelize;