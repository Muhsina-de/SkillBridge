import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import reviewRoutes from './routes/review.routes';
import gitRoutes from './routes/github.Routes';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profile.Route';
export function createServer() {
  const app = express();
  
  // Configure CORS
  const corsOptions = {
    origin: 'http://localhost:5173', // Adjust this to match your frontend's URL
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  
  app.use(express.json());
 


  // API Routes
  app.use('/api/reviews', reviewRoutes);
  app.use('/api', gitRoutes);

  app.use('/api/auth', authRoutes);
  app.use('/api/profiles', profileRoutes);

  app.get('/api/health', (_req: Request, res: Response) => {
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

export function startServer(app: express.Application, port: number = 3000) {
  return app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}