import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'skillbridge_test',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    dialectOptions: {
      decimalNumbers: true,
    },
    logging: false // Disable logging during tests
  }
);

export const setupTestDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Test database connection established.');
    await sequelize.sync({ force: true }); // Clear and recreate tables
  } catch (error) {
    console.error('Unable to connect to the test database:', error);
    process.exit(1);
  }
};

export const closeTestDb = async () => {
  await sequelize.close();
};

export default sequelize; 