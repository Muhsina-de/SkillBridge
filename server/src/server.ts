import express from 'express';
import cors from 'cors';
import path from 'path';
import reviewRoutes from './routes/review.routes';
import githubRoutes from './routes/github.routes';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import forumsRoutes from './routes/forums.routes';
import dashboardRoutes from './routes/dashboard.routes';
import sessionRoutes from './routes/session.routes';
import User from './models/user';
import ForumTopic from './models/ForumTopics';
import ForumComment from './models/ForumComments';
import { authenticateToken } from './middleware/auth';
import { sequelize } from './config/connection';
import { seedDemoUser } from './seeds/demo-user';
import { seedForumTopics, clearForumData } from './seeds/forum-topics';
import { seedMentors } from './seeds/mentor-seeds';
import config from './config';
import { limiter, authLimiter } from './middleware/rateLimiter';
import { up as runMigrations } from './migrations';
import { errorHandler } from './middleware/errorHandler';
import { setupSocketIO } from './socket';
import dotenv from 'dotenv';

dotenv.config();

// Define associations
ForumTopic.hasMany(ForumComment, { foreignKey: 'topicId' });
ForumComment.belongsTo(ForumTopic, { foreignKey: 'topicId' });        

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/forums', forumsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sessions', sessionRoutes);

// Error handling middleware
app.use(errorHandler);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;