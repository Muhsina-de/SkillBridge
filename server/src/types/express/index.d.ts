import express from 'express';
import { User } from '../../models';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
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

// Export Express namespace and its properties
export = express;
export as namespace Express;

// Export commonly used types
export type Request = express.Request;
export type Response = express.Response;
export type NextFunction = express.NextFunction;
export type Router = express.Router;
export type Application = express.Application;

// Export commonly used properties
export const Router: typeof express.Router;
export const json: typeof express.json;
export const static: typeof express.static;
