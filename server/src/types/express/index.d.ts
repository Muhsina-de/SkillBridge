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

// Re-export Express types and values
export * from 'express';
