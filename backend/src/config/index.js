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

  email: {
    brevoApiKey: process.env.BREVO_API_KEY || '',
    senderEmail: process.env.BREVO_SENDER_EMAIL || 'no-reply@carebridge.com',
    senderName: process.env.BREVO_SENDER_NAME || 'CareBridge Specialist Hospital',
    replyToEmail: process.env.BREVO_REPLY_TO || process.env.BREVO_SENDER_EMAIL || '',
    otpSecret: process.env.OTP_SECRET || process.env.JWT_ACCESS_SECRET || 'fallback_otp_secret',
    otpLength: 6,
    otpExpiresMinutes: parseInt(process.env.OTP_EXPIRES_MINUTES) || 10,
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS) || 5,
    resendCooldownSeconds: parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60,
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
