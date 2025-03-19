import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import reviewRoutes from './routes/review.routes';
import gitRoutes from './routes/github.Routes';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profile.Route';
<<<<<<< HEAD
import { authenticateJWT } from './middleware/authmiddleware';
import { sequelize } from './models';
=======
import forumRoutes from './routes/forums.routes';
import { UserFactory } from './models/user';
import ForumTopic from './models/ForumTopics'; // Import ForumTopic model
import ForumComment from './models/ForumComments'; // And ForumComment if needed
import { authenticateJWT } from './middleware/authmiddleware';
import sequelize from './config/connection'; // Import the centralized Sequelize instance

// Initialize models so they are registered with the sequelize instance
const User = UserFactory(sequelize);
>>>>>>> origin/master

// Define associations
ForumTopic.hasMany(ForumComment, { foreignKey: 'topicId' });
ForumComment.belongsTo(ForumTopic, { foreignKey: 'topicId' });

export function createServer() {
  const app = express();
  
  const corsOptions = {
<<<<<<< HEAD
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
=======
    origin: 'http://localhost:5173',
>>>>>>> origin/master
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  
  app.use(express.json());
<<<<<<< HEAD

  // API Routes
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/github', gitRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', authenticateJWT, profileRoutes);

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ message: 'Server is running!' });
  });

  // Add a simple test endpoint
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  // Serve static files
=======
 
  app.use('/api/reviews', authenticateJWT, reviewRoutes);
  app.use('/api', gitRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/profiles', authenticateJWT, profileRoutes);
  app.use('/api/forum', forumRoutes);
  
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ message: 'Server is running!' });
  });
  
>>>>>>> origin/master
  app.use(express.static(path.join(__dirname, '../public')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
  
  return app;
}

export function startServer(app: express.Application, port: number = 3001) {
  // Sync Sequelize models and then start the server
  sequelize.sync({ force: false }).then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log('CORS enabled for:', ['http://localhost:5173', 'http://localhost:3000']);
    });
  }).catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
}
