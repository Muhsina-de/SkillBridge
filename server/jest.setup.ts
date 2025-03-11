import { Server } from 'http';
import sequelize from './src/config/test-connection';

let server: Server | undefined;

export default async function globalTeardown() {
  // Close database connection
  await sequelize.close();

  // Add a small delay to ensure all connections are closed
  await new Promise((resolve) => setTimeout(resolve, 500));
} 