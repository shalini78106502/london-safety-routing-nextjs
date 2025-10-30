const { pool } = require('../config/database');

/**
 * Enhanced Hazard System Migration
 * Adds real-time notification support, improved indexing, and additional hazard types
 */
async function migrateHazardSystem() {
  try {
    console.log('🔧 Migrating hazard system for real-time features...');

    // Update hazards table with additional fields
    await pool.query(`
      ALTER TABLE hazards 
      ADD COLUMN IF NOT EXISTS reporter_contact VARCHAR(255),
      ADD COLUMN IF NOT EXISTS incident_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS priority_level INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS affects_traffic BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS weather_related BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP NULL,
      ADD COLUMN IF NOT EXISTS resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL
    `);
    console.log('✅ Hazards table enhanced with new fields');

    // Create hazard_notifications table for real-time alerts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hazard_notifications (
        id SERIAL PRIMARY KEY,
        hazard_id INTEGER REFERENCES hazards(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        notification_type VARCHAR(50) NOT NULL, -- 'new_hazard', 'hazard_resolved', 'hazard_nearby'
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        distance_meters INTEGER
      );
    `);
    console.log('✅ Hazard notifications table created');

    // Create hazard_subscriptions table for location-based alerts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hazard_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        location GEOMETRY(POINT, 4326) NOT NULL,
        radius_meters INTEGER DEFAULT 1000,
        hazard_types TEXT[] DEFAULT ARRAY['all'],
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Hazard subscriptions table created');

    // Create optimized indexes for real-time queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_hazards_severity ON hazards(severity);
      CREATE INDEX IF NOT EXISTS idx_hazards_type ON hazards(hazard_type);
      CREATE INDEX IF NOT EXISTS idx_hazards_created_at ON hazards(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_hazards_resolved ON hazards(is_resolved, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_hazards_priority ON hazards(priority_level DESC, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON hazard_notifications(user_id, is_read);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_location ON hazard_subscriptions USING GIST(location);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON hazard_subscriptions(user_id, is_active);
    `);
    console.log('✅ Performance indexes created');

    // Create function to calculate hazard priority
    await pool.query(`
      CREATE OR REPLACE FUNCTION calculate_hazard_priority(
        hazard_type VARCHAR,
        severity VARCHAR,
        affects_traffic BOOLEAN
      ) RETURNS INTEGER AS $$
      BEGIN
        RETURN CASE
          WHEN severity = 'critical' THEN 5
          WHEN severity = 'high' AND affects_traffic THEN 4
          WHEN severity = 'high' THEN 3
          WHEN severity = 'medium' AND affects_traffic THEN 3
          WHEN severity = 'medium' THEN 2
          ELSE 1
        END;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Priority calculation function created');

    // Create trigger to auto-update priority
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_hazard_priority() RETURNS TRIGGER AS $$
      BEGIN
        NEW.priority_level = calculate_hazard_priority(
          NEW.hazard_type, 
          NEW.severity, 
          NEW.affects_traffic
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_update_hazard_priority ON hazards;
      CREATE TRIGGER trigger_update_hazard_priority
        BEFORE INSERT OR UPDATE ON hazards
        FOR EACH ROW EXECUTE FUNCTION update_hazard_priority();
    `);
    console.log('✅ Auto-priority update trigger created');

    // Insert sample hazards for testing
    await insertSampleHazards();

    console.log('🎉 Hazard system migration completed successfully!');
  } catch (error) {
    console.error('❌ Hazard system migration failed:', error);
    throw error;
  }
}

async function insertSampleHazards() {
  try {
    // Check if hazards already exist
    const result = await pool.query('SELECT COUNT(*) FROM hazards');
    if (parseInt(result.rows[0].count) > 0) {
      console.log('📊 Sample hazards already exist, skipping...');
      return;
    }

    // Sample hazards around London
    const sampleHazards = [
      {
        description: 'Major roadworks causing lane closures on A40. Heavy traffic delays expected.',
        location: 'POINT(-0.2817 51.5151)', // Shepherd\'s Bush
        hazard_type: 'construction',
        severity: 'high',
        affects_traffic: true
      },
      {
        description: 'Broken streetlight creating dark area. Pedestrian visibility compromised.',
        location: 'POINT(-0.1278 51.5074)', // Central London
        hazard_type: 'poor_lighting',
        severity: 'medium',
        affects_traffic: false
      },
      {
        description: 'Large pothole on cycling route. Risk of injury to cyclists.',
        location: 'POINT(-0.0759 51.5051)', // Tower Bridge area
        hazard_type: 'road_damage',
        severity: 'medium',
        affects_traffic: true
      },
      {
        description: 'Flash flooding after heavy rain. Road partially impassable.',
        location: 'POINT(-0.1950 51.4871)', // Battersea
        hazard_type: 'flooding',
        severity: 'critical',
        weather_related: true,
        affects_traffic: true
      },
      {
        description: 'Suspicious activity reported in park area. Increased police presence.',
        location: 'POINT(-0.1637 51.5126)', // Hyde Park area
        hazard_type: 'crime',
        severity: 'high',
        affects_traffic: false
      }
    ];

    for (const hazard of sampleHazards) {
      await pool.query(`
        INSERT INTO hazards (
          description, location, hazard_type, severity, 
          affects_traffic, weather_related, incident_time
        )
        VALUES ($1, ST_GeomFromText($2, 4326), $3, $4, $5, $6, CURRENT_TIMESTAMP)
      `, [
        hazard.description, 
        hazard.location, 
        hazard.hazard_type, 
        hazard.severity,
        hazard.affects_traffic || false,
        hazard.weather_related || false
      ]);
    }

    console.log('✅ Sample hazards inserted');
  } catch (error) {
    console.error('❌ Failed to insert sample hazards:', error);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  migrateHazardSystem()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrateHazardSystem;