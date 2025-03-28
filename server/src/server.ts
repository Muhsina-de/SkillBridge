import express from 'express';
import cors from 'cors';
import path from 'path';
import reviewRoutes from './routes/review.routes';
import gitRoutes from './routes/github.routes';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import forumRoutes from './routes/forums.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { UserFactory } from './models/user';
import ForumTopic from './models/ForumTopics';
import ForumComment from './models/ForumComments';
import { authenticateJWT } from './middleware/auth';
import { sequelize } from './config/connection';
import { seedDemoUser } from './seeds/demo-user';
import { seedForumTopics, clearForumData } from './seeds/forum-topics';
import { seedMentors } from './seeds/mentor-seeds';
import { config } from './config';
import { limiter, authLimiter } from './middleware/rateLimiter';
import { up as runMigrations } from './migrations';
import { errorHandler } from './middleware/errorHandler';
import { setupSocketIO } from './socket';

// Initialize models so they are registered with the sequelize instance
const User = UserFactory(sequelize);

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
app.use('/api/github', gitRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
}

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup Socket.IO
setupSocketIO(server);

// Sync database and seed if needed
sequelize.sync({ force: false }).then(async () => {
  console.log('Database synced');
  await seedDemoUser();
  await seedMentors();
  await clearForumData();
  await seedForumTopics();
});