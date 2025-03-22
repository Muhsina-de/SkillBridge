import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// Load environment variables
config();

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  dialectOptions: {
    decimalNumbers: true,
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

console.log('Sequelize instance created');

export default sequelize;
