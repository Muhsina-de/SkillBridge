import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import reviewRoutes from './routes/review.routes';
import gitRoutes from './routes/github.Routes';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profile.Route';
import {UserFactory} from './models/user';
import { authenticateJWT } from './middleware/authmiddleware'; // Import the authentication middleware
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
  logging: false, // Disable logging if not needed
});
// Initialize the User model
const User = UserFactory(sequelize);

export function createServer() {
  const app = express();
  
  // Configure CORS
  const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  
  app.use(express.json());
 


  // API Routes
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/github', gitRoutes);

  app.use('/api/auth', authRoutes);
  app.use('/api/profiles', authenticateJWT, profileRoutes);
 // app.use(authenticateJWT); // Use the authentication middleware for all routes under /api

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ message: 'Server is running!' });
  });

  // Add a simple test endpoint
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  // Serve static files
  app.use(express.static(path.join(__dirname, '../public')));

  // Serve the index.html file for all other routes
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