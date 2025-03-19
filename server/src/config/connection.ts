import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// Load environment variables
config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ravenest',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    dialectOptions: {
      decimalNumbers: true,
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);
console.log('Sequelize instance created');


export default sequelize;
