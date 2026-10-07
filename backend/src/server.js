'use strict';

require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const config = require('./config');

const PORT = config.port;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║         CareBridge Specialist Hospital - API Server          ║
╠══════════════════════════════════════════════════════════════╣
║  Status:      Running                                        ║
║  Port:        ${String(PORT).padEnd(46)}║
║  Environment: ${config.nodeEnv.padEnd(46)}║
║  API Base:    http://localhost:${PORT}/api                   ║
║  Health:      http://localhost:${PORT}/api/health            ║
╚══════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('   Make sure PostgreSQL is running and your .env credentials are correct.');
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

startServer();
