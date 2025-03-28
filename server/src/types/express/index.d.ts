import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
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
  user?: {
    id: number;
    username: string;
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

export type Request = express.Request;
export type Response = express.Response;
export type NextFunction = express.NextFunction;
export type Router = express.Router;
export type Application = express.Application;
