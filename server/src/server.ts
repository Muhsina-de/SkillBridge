import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import reviewRoutes from './routes/review.routes';
import gitRoutes from './routes/github.Routes';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profile.Route';
import forumRoutes from './routes/forums.routes';
import { UserFactory } from './models/user';
import ForumTopic from './models/ForumTopics';
import ForumComment from './models/ForumComments';
import { authenticateJWT } from './middleware/authmiddleware';
import { sequelize } from './models';
import { seedDemoUser } from './seeders/demo-user';
import { seedForumTopics, clearForumData } from './seeders/forum-topics';
import { seedMentors } from './seeders/mentor-seeders';
import config from './config';
import { limiter, authLimiter } from './middleware/rateLimiter';
import { up as runMigrations } from './migrations';

// Initialize models so they are registered with the sequelize instance
const User = UserFactory(sequelize);

// Define associations
ForumTopic.hasMany(ForumComment, { foreignKey: 'topicId' });
ForumComment.belongsTo(ForumTopic, { foreignKey: 'topicId' });        

export function createServer() {
  const app = express();

  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CORS_ORIGIN 
      : ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));

  app.use(express.json());

  // Apply rate limiting to all routes
  app.use(limiter);

  // Apply stricter rate limiting to auth routes
  app.use('/api/auth', authLimiter);

  // Health check and test endpoints
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ message: 'Server is running!' });
  });

  app.get('/api/test', (_req: Request, res: Response) => {
    res.json({ message: 'Server is running!' });
  });

  // API Routes
  app.use('/api/reviews', authenticateJWT, reviewRoutes);
  app.use('/api/github', gitRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/profiles', authenticateJWT, profileRoutes);
  app.use('/api/forum', forumRoutes);

  // Serve static files (moved after API routes)
  app.use(express.static(path.join(__dirname, '../public')));
  
  // Catch-all route for SPA (moved after static files)
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));       
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to RaveNest API');
  });

  return app;
}

export function startServer(app: express.Application, port: number = process.env.PORT ? parseInt(process.env.PORT) : 3001) {
  // Run migrations first, then sync models and start the server
  runMigrations().then(async () => {
    try {
      // Force sync the database to ensure tables are created with correct schema
      await sequelize.sync({ force: true });
      
      // Wait a moment to ensure the database is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // First, ensure demo user exists
      const demoUser = await User.findOne({ where: { email: 'john@example.com' } });
      if (!demoUser) {
        try {
          await seedDemoUser();
        } catch (error) {
          console.error('Error creating demo user:', error);
          // Continue with server startup even if demo user creation fails
        }
      }
      
      // Then seed mentors
      try {
        await seedMentors();
      } catch (error) {
        console.error('Error seeding mentors:', error);
        // Continue with server startup even if mentor seeding fails
      }
      
      // Finally, seed forum data
      try {
        await clearForumData();
        await seedForumTopics();
      } catch (error) {
        console.error('Error seeding forum data:', error);
        // Continue with server startup even if forum seeding fails
      }
      
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        if (process.env.NODE_ENV === 'production') {
          console.log('Running in production mode');
          console.log(`CORS enabled for: ${process.env.CORS_ORIGIN}`);
        } else {
          console.log('Running in development mode');
          console.log('CORS enabled for:', ['http://localhost:5173', 'http://localhost:3000']);
        }
      });
    } catch (error) {
      console.error('Error during server startup:', error);
      process.exit(1);
    }
  }).catch((err) => {
    console.error('Error during migration:', err);
    process.exit(1);
  });
}