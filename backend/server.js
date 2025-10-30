const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import database and real-time system
const { pool, initializeNotifyClient, checkDatabaseHealth } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const routesRoutes = require('./routes/routes');
const hazardsRoutes = require('./routes/hazards');
const buddiesRoutes = require('./routes/buddies');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    res.json({
      success: true,
      message: 'London Safety Routing API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbHealth,
      version: '2.0.0 - Optimized'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service partially unavailable',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/hazards', hazardsRoutes);
app.use('/api/buddies', buddiesRoutes);

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server with real-time system initialization
app.listen(PORT, async () => {
  console.log(`🚀 London Safety Routing API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS enabled for: ${process.env.FRONTEND_URL}`);
  console.log(`⚡ PostgreSQL optimized for <100ms spatial queries`);
  
  // Initialize real-time notification system
  try {
    await initializeNotifyClient();
    console.log(`🎯 Real-time hazard notification system active`);
  } catch (error) {
    console.error(`❌ Failed to initialize real-time system:`, error.message);
  }
});

module.exports = app;