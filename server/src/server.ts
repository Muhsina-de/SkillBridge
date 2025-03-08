import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import reviewRoutes from './routes/review.routes';

export function createServer() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/reviews', reviewRoutes);

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ message: 'Server is running!' });
  });

  app.use(express.static(path.join(__dirname, '../public')));

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