require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'carebridge_hospital',
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASS || 'password',
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    refreshCookieName: 'carebridge_refresh_token',
  },

  cors: {
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  },

  bcrypt: {
    rounds: 12,
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    authMax: 10, // stricter for auth endpoints
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};
