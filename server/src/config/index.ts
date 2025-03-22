import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  // Server configuration
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret-key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // API Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Client URL (for CORS and redirects)
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
    'Please check your .env file or environment configuration.'
  );
}

// Warn about default JWT secret in production
if (process.env.NODE_ENV === 'production' && config.JWT_SECRET === 'your-default-secret-key') {
  console.warn(
    'WARNING: Using default JWT secret in production environment.\n' +
    'Please set a secure JWT_SECRET environment variable.'
  );
}

export default config; 