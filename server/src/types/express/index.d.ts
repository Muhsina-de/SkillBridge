import express from 'express';
import { User } from '../../models';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      headers: {
        authorization?: string;
        [key: string]: string | string[] | undefined;
      };
      body: any;
      params: any;
      query: any;
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

// Type exports
export type Request = express.Request;
export type Response = express.Response;
export type NextFunction = express.NextFunction;
