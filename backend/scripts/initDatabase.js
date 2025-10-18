const pool = require('../config/database');

async function initDatabase() {
  try {
    console.log('🔧 Initializing database schema...');

    // Enable PostGIS extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('✅ PostGIS extension enabled');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        emergency_contact VARCHAR(50),
        preferred_transport VARCHAR(50) DEFAULT 'walking',
        safety_priority VARCHAR(50) DEFAULT 'high',
        notifications BOOLEAN DEFAULT true,
        location GEOMETRY(POINT, 4326),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create routes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        path GEOMETRY(LINESTRING, 4326),
        difficulty VARCHAR(50) DEFAULT 'medium',
        distance_km DECIMAL(10, 2),
        estimated_time_minutes INTEGER,
        safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Routes table created');

    // Create hazards table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hazards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        location GEOMETRY(POINT, 4326) NOT NULL,
        hazard_type VARCHAR(100) NOT NULL,
        severity VARCHAR(50) DEFAULT 'medium',
        is_resolved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Hazards table created');

    // Create spatial indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIST (location);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_routes_path ON routes USING GIST (path);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_hazards_location ON hazards USING GIST (location);');
    console.log('✅ Spatial indexes created');

    // Insert sample routes data
    await insertSampleRoutes();
    
    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function insertSampleRoutes() {
  try {
    // Check if routes already exist
    const result = await pool.query('SELECT COUNT(*) FROM routes');
    if (parseInt(result.rows[0].count) > 0) {
      console.log('📊 Sample routes already exist, skipping...');
      return;
    }

    // Sample London routes with real coordinates
    const sampleRoutes = [
      {
        name: 'Hyde Park to Westminster',
        description: 'Scenic route through central London parks and landmarks',
        path: 'LINESTRING(-0.165806 51.508515, -0.157123 51.505419, -0.145712 51.502321, -0.134289 51.499842, -0.128374 51.500729)',
        difficulty: 'easy',
        distance_km: 2.8,
        estimated_time_minutes: 35,
        safety_rating: 4
      },
      {
        name: 'Thames Path - Tower Bridge to London Bridge',
        description: 'Beautiful riverside walk along the Thames',
        path: 'LINESTRING(-0.075384 51.505455, -0.081743 51.504872, -0.087052 51.504412)',
        difficulty: 'easy',
        distance_km: 1.2,
        estimated_time_minutes: 15,
        safety_rating: 5
      },
      {
        name: 'Regent Street Shopping Route',
        description: 'Safe walking route through major shopping areas',
        path: 'LINESTRING(-0.140634 51.515419, -0.141789 51.513284, -0.142567 51.511023)',
        difficulty: 'medium',
        distance_km: 1.8,
        estimated_time_minutes: 25,
        safety_rating: 4
      },
      {
        name: 'Camden to King\'s Cross',
        description: 'Urban route connecting vibrant neighborhoods',
        path: 'LINESTRING(-0.143056 51.539444, -0.137778 51.534167, -0.125833 51.530556)',
        difficulty: 'medium',
        distance_km: 2.1,
        estimated_time_minutes: 28,
        safety_rating: 3
      },
      {
        name: 'Greenwich Park Circuit',
        description: 'Peaceful route through historic Greenwich',
        path: 'LINESTRING(0.002778 51.477778, 0.006944 51.478889, 0.008333 51.481111, 0.002778 51.477778)',
        difficulty: 'easy',
        distance_km: 1.5,
        estimated_time_minutes: 20,
        safety_rating: 5
      }
    ];

    for (const route of sampleRoutes) {
      await pool.query(`
        INSERT INTO routes (name, description, path, difficulty, distance_km, estimated_time_minutes, safety_rating)
        VALUES ($1, $2, ST_GeomFromText($3, 4326), $4, $5, $6, $7)
      `, [route.name, route.description, route.path, route.difficulty, route.distance_km, route.estimated_time_minutes, route.safety_rating]);
    }

    console.log('✅ Sample routes inserted');
  } catch (error) {
    console.error('❌ Failed to insert sample routes:', error);
    throw error;
  }
}

// Run the initialization
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;