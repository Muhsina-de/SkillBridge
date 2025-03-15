import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import reviewRoutes from './routes/review.routes';
import gitRoutes from './routes/github.Routes';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profile.Route';
import { createServer, startServer } from './server';

const app = createServer();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/reviews', reviewRoutes);
app.use('api/auth', authRoutes)
app.use('/api', gitRoutes)
app.use('api/profile', profileRoutes)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ message: 'Serve is running!' });
});

app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

let server;
if (process.env.NODE_ENV !== 'test') {
  server = startServer(app, port);
}

export { app, server };