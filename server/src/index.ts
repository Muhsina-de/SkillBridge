import express from 'express';
import cors from 'cors';
import config from './config';
import { sequelize } from './models';
import authRoutes from './routes/auth.routes';
import forumRoutes from './routes/forums.routes';
import githubRoutes from './routes/github.routes';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';
import { seedDemoUser } from './seeds/demo-user';
import { seedMentors } from './seeds/mentor-seeds';
import { clearForumData, seedForumTopics } from './seeds/forum-topics';
import { setupSocketIO } from './socket';

const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forums', authenticateToken, forumRoutes);
app.use('/api/github', authenticateToken, githubRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database (in development)
    if (config.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced.');
    }

    // Sync database and seed if needed
    await sequelize.sync({ force: false }).then(async () => {
      console.log('Database synced');
      await seedDemoUser();
      await seedMentors();
      await clearForumData();
      await seedForumTopics();
    });

    // Start server
    if (!config.PORT) {
      throw new Error('PORT environment variable is not set');
    }

    const server = app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });

    // Setup Socket.IO
    setupSocketIO(server);
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();