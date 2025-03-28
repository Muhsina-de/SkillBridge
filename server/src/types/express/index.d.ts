import express from 'express';
import { User } from '../../models';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthRequest extends express.Request {
  user?: User;
  headers: {
    authorization?: string;
    [key: string]: string | string[] | undefined;
  };
  body: any;
  params: any;
  query: any;
}

// Export Express types
export type Request = express.Request;
export type Response = express.Response;
export type NextFunction = express.NextFunction;
export type Router = express.Router;
export type Application = express.Application;

// Re-export express
export default express;
