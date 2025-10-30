const { Pool, Client } = require('pg');
require('dotenv').config();

// Optimized connection pool configuration
const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Performance optimization settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client can sit idle before being closed
  connectionTimeoutMillis: 2000, // Return an error if connection takes longer than 2 seconds
  maxUses: 7500, // Close connections after 7500 queries to prevent memory leaks
  // Enable prepared statements for better performance
  statement_timeout: 10000, // 10 second statement timeout
  query_timeout: 10000, // 10 second query timeout
};

// Main connection pool for application queries
const pool = new Pool(poolConfig);

// Dedicated client for LISTEN/NOTIFY (long-lived connection)
const notifyClient = new Client(poolConfig);

// Connection event handlers
pool.on('connect', (client) => {
  console.log('✅ New client connected to PostgreSQL pool');
  
  // Set up session optimizations for each connection
  client.query(`
    SET work_mem = '256MB';
    SET jit = on;
    SET enable_partitionwise_join = on;
    SET enable_partitionwise_aggregate = on;
  `).catch(err => console.log('Session optimization warning:', err.message));
});

pool.on('error', (err, client) => {
  console.error('❌ Database pool error:', err);
});

pool.on('acquire', (client) => {
  // Client acquired from pool
});

pool.on('remove', (client) => {
  console.log('🔄 Client removed from pool');
});

// Initialize notification client
let isNotifyClientConnected = false;

async function initializeNotifyClient() {
  try {
    if (!isNotifyClientConnected) {
      // Check if client is already connected before attempting connection
      if (notifyClient._connected) {
        isNotifyClientConnected = true;
        console.log('✅ Notification client already connected, reusing connection');
      } else {
        await notifyClient.connect();
        isNotifyClientConnected = true;
        console.log('✅ Notification client connected for LISTEN/NOTIFY');
      }
      
      // Set up LISTEN for hazard notifications (safe to call multiple times)
      await notifyClient.query('LISTEN hazards_channel');
      console.log('👂 Listening for hazard notifications on PostgreSQL');
    }
  } catch (error) {
    console.error('❌ Failed to initialize notification client:', error.message);
    isNotifyClientConnected = false;
    
    // If connection failed, try to create a new client
    try {
      const { Client } = require('pg');
      const newNotifyClient = new Client(poolConfig);
      await newNotifyClient.connect();
      module.exports.notifyClient = newNotifyClient;
      isNotifyClientConnected = true;
      console.log('✅ Created new notification client');
    } catch (retryError) {
      console.error('❌ Failed to create new notification client:', retryError.message);
    }
  }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down database connections...');
  try {
    await pool.end();
    if (isNotifyClientConnected) {
      await notifyClient.end();
    }
    console.log('✅ Database connections closed gracefully');
  } catch (err) {
    console.error('❌ Error during database shutdown:', err);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down database connections...');
  try {
    await pool.end();
    if (isNotifyClientConnected) {
      await notifyClient.end();
    }
  } catch (err) {
    console.error('❌ Error during database shutdown:', err);
  }
});

// Health check function
async function checkDatabaseHealth() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW(), version()');
    client.release();
    return {
      status: 'healthy',
      timestamp: result.rows[0].now,
      version: result.rows[0].version,
      poolStats: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Performance monitoring
setInterval(async () => {
  const stats = {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };
  
  if (stats.waitingCount > 5) {
    console.warn('⚠️  High database connection wait queue:', stats);
  }
}, 30000); // Check every 30 seconds

module.exports = {
  pool,
  notifyClient,
  initializeNotifyClient,
  checkDatabaseHealth,
  isNotifyClientConnected: () => isNotifyClientConnected
};