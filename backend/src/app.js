'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const { errorHandler } = require('./middlewares/errorHandler');
const { sendError } = require('./utils/response');

// Import routes
const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/departments');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const serviceRoutes = require('./routes/services');
const blogRoutes = require('./routes/blog');
const publicRoutes = require('./routes/public');
const patientRoutes = require('./routes/patients');
const medicalRecordRoutes = require('./routes/medicalRecords');
const adminRoutes = require('./routes/admin');

const app = express();

// ---- Security ----
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: config.cors.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ---- Request parsing ----
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---- Logging ----
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
}

// ---- Global rate limiter ----
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP. Please try again later.' },
  })
);

// ---- Health check ----
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CareBridge API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ---- API Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/health-tips', blogRoutes);
app.use('/api', publicRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/admin', adminRoutes);

// ---- 404 handler ----
app.use((req, res) => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
});

// ---- Global error handler (must be last) ----
app.use(errorHandler);

module.exports = app;
