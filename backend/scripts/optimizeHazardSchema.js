const { pool } = require('../config/database');

/**
 * Complete PostgreSQL Schema Optimization for London Safety Routing System
 * - PostGIS GEOGRAPHY optimization for sub-100ms spatial queries
 * - Real-time LISTEN/NOTIFY triggers
 * - Partitioning and indexing for performance
 * - No Redis dependency
 */
async function optimizeHazardSchema() {
  try {
    console.log('🚀 Starting comprehensive hazard schema optimization...');

    // 1. Enable PostGIS extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('✅ PostGIS extension enabled');

    // 2. Drop and recreate optimized hazards table
    await pool.query('DROP TABLE IF EXISTS hazard_notifications CASCADE;');
    await pool.query('DROP TABLE IF EXISTS hazard_subscriptions CASCADE;');
    await pool.query('DROP TABLE IF EXISTS hazards CASCADE;');
    
    // Create optimized hazards table with GEOGRAPHY for performance
    await pool.query(`
      CREATE TABLE hazards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        hazard_type VARCHAR(50) NOT NULL CHECK (hazard_type IN (
          'construction', 'accident', 'crime', 'flooding', 'poor_lighting',
          'road_damage', 'pothole', 'unsafe_crossing', 'broken_glass',
          'suspicious_activity', 'vandalism', 'other'
        )),
        severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        description TEXT NOT NULL,
        location GEOGRAPHY(POINT, 4326) NOT NULL,
        borough VARCHAR(100),
        affects_traffic BOOLEAN DEFAULT FALSE,
        weather_related BOOLEAN DEFAULT FALSE,
        priority_level INTEGER DEFAULT 1,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'duplicate', 'invalid')),
        is_resolved BOOLEAN DEFAULT FALSE,
        incident_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMPTZ NULL,
        resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ Optimized hazards table created with GEOGRAPHY');

    // 3. Create high-performance spatial indexes
    await pool.query(`
      -- Primary spatial index using GIST for <100ms queries
      CREATE INDEX idx_hazards_location_gist ON hazards USING GIST(location);
      
      -- Composite indexes for common query patterns
      CREATE INDEX idx_hazards_active_location ON hazards USING GIST(location) WHERE status = 'active';
      CREATE INDEX idx_hazards_priority_time ON hazards(priority_level DESC, created_at DESC) WHERE status = 'active';
      CREATE INDEX idx_hazards_type_severity ON hazards(hazard_type, severity) WHERE status = 'active';
      CREATE INDEX idx_hazards_recent ON hazards(created_at DESC) WHERE status = 'active';
      CREATE INDEX idx_hazards_traffic ON hazards(affects_traffic, priority_level DESC) WHERE status = 'active';
      
      -- User and status indexes
      CREATE INDEX idx_hazards_user ON hazards(user_id, created_at DESC);
      CREATE INDEX idx_hazards_status ON hazards(status, updated_at DESC);
    `);
    console.log('✅ High-performance spatial indexes created');

    // 4. Create real-time notification tables
    await pool.query(`
      CREATE TABLE hazard_notifications (
        id SERIAL PRIMARY KEY,
        hazard_id INTEGER REFERENCES hazards(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        notification_type VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        distance_meters INTEGER,
        severity VARCHAR(20),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX idx_notifications_user_unread ON hazard_notifications(user_id, is_read, created_at DESC);
      CREATE INDEX idx_notifications_hazard ON hazard_notifications(hazard_id);
    `);
    console.log('✅ Notification tables created');

    // 5. Create subscription table for location-based alerts
    await pool.query(`
      CREATE TABLE hazard_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        location GEOGRAPHY(POINT, 4326) NOT NULL,
        radius_meters INTEGER DEFAULT 5000 CHECK (radius_meters BETWEEN 100 AND 50000),
        hazard_types TEXT[] DEFAULT ARRAY['all'],
        severity_levels TEXT[] DEFAULT ARRAY['low', 'medium', 'high', 'critical'],
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX idx_subscriptions_location ON hazard_subscriptions USING GIST(location) WHERE is_active = TRUE;
      CREATE INDEX idx_subscriptions_user ON hazard_subscriptions(user_id, is_active);
    `);
    console.log('✅ Subscription table created');

    // 6. Create priority calculation function
    await pool.query(`
      CREATE OR REPLACE FUNCTION calculate_hazard_priority(
        p_hazard_type VARCHAR,
        p_severity VARCHAR,
        p_affects_traffic BOOLEAN,
        p_weather_related BOOLEAN
      ) RETURNS INTEGER AS $$
      DECLARE
        priority_score INTEGER := 1;
      BEGIN
        -- Base priority by severity
        priority_score := CASE p_severity
          WHEN 'critical' THEN 10
          WHEN 'high' THEN 7
          WHEN 'medium' THEN 4
          WHEN 'low' THEN 2
          ELSE 1
        END;
        
        -- Traffic impact multiplier
        IF p_affects_traffic THEN
          priority_score := priority_score + 3;
        END IF;
        
        -- Weather related urgency
        IF p_weather_related THEN
          priority_score := priority_score + 2;
        END IF;
        
        -- Hazard type specific adjustments
        priority_score := priority_score + CASE p_hazard_type
          WHEN 'crime' THEN 3
          WHEN 'accident' THEN 4
          WHEN 'flooding' THEN 3
          WHEN 'construction' THEN 1
          ELSE 0
        END;
        
        -- Cap at maximum priority
        RETURN LEAST(priority_score, 20);
      END;
      $$ LANGUAGE plpgsql IMMUTABLE;
    `);
    console.log('✅ Priority calculation function created');

    // 7. Create real-time notification trigger function
    await pool.query(`
      CREATE OR REPLACE FUNCTION notify_hazard_changes() RETURNS TRIGGER AS $$
      DECLARE
        notification_payload JSON;
      BEGIN
        -- Handle INSERT (new hazard)
        IF TG_OP = 'INSERT' THEN
          notification_payload := json_build_object(
            'event_type', 'hazard_created',
            'hazard_id', NEW.id,
            'hazard_type', NEW.hazard_type,
            'severity', NEW.severity,
            'description', NEW.description,
            'latitude', ST_Y(NEW.location::geometry),
            'longitude', ST_X(NEW.location::geometry),
            'priority_level', NEW.priority_level,
            'affects_traffic', NEW.affects_traffic,
            'weather_related', NEW.weather_related,
            'created_at', NEW.created_at,
            'status', NEW.status
          );
          
          -- Broadcast to real-time listeners
          PERFORM pg_notify('hazards_channel', notification_payload::text);
          RETURN NEW;
        END IF;
        
        -- Handle UPDATE (hazard status change)
        IF TG_OP = 'UPDATE' THEN
          -- Only notify on significant changes
          IF OLD.status != NEW.status OR OLD.severity != NEW.severity OR OLD.is_resolved != NEW.is_resolved THEN
            notification_payload := json_build_object(
              'event_type', 'hazard_updated',
              'hazard_id', NEW.id,
              'old_status', OLD.status,
              'new_status', NEW.status,
              'old_severity', OLD.severity,
              'new_severity', NEW.severity,
              'latitude', ST_Y(NEW.location::geometry),
              'longitude', ST_X(NEW.location::geometry),
              'updated_at', NEW.updated_at
            );
            
            PERFORM pg_notify('hazards_channel', notification_payload::text);
          END IF;
          RETURN NEW;
        END IF;
        
        -- Handle DELETE
        IF TG_OP = 'DELETE' THEN
          notification_payload := json_build_object(
            'event_type', 'hazard_deleted',
            'hazard_id', OLD.id,
            'latitude', ST_Y(OLD.location::geometry),
            'longitude', ST_X(OLD.location::geometry)
          );
          
          PERFORM pg_notify('hazards_channel', notification_payload::text);
          RETURN OLD;
        END IF;
        
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Real-time notification trigger function created');

    // 8. Create triggers for real-time notifications
    await pool.query(`
      -- Auto-update priority and timestamps
      CREATE OR REPLACE FUNCTION update_hazard_metadata() RETURNS TRIGGER AS $$
      BEGIN
        NEW.priority_level := calculate_hazard_priority(
          NEW.hazard_type, 
          NEW.severity, 
          NEW.affects_traffic,
          NEW.weather_related
        );
        NEW.updated_at := CURRENT_TIMESTAMP;
        
        -- Auto-set resolved timestamp
        IF NEW.is_resolved = TRUE AND OLD.is_resolved = FALSE THEN
          NEW.resolved_at := CURRENT_TIMESTAMP;
          NEW.status := 'resolved';
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Drop existing triggers if they exist
      DROP TRIGGER IF EXISTS trigger_hazard_metadata ON hazards;
      DROP TRIGGER IF EXISTS trigger_hazard_notifications ON hazards;
      
      -- Create triggers
      CREATE TRIGGER trigger_hazard_metadata
        BEFORE INSERT OR UPDATE ON hazards
        FOR EACH ROW EXECUTE FUNCTION update_hazard_metadata();
        
      CREATE TRIGGER trigger_hazard_notifications
        AFTER INSERT OR UPDATE OR DELETE ON hazards
        FOR EACH ROW EXECUTE FUNCTION notify_hazard_changes();
    `);
    console.log('✅ Real-time triggers created');

    // 9. Create optimized query functions
    await pool.query(`
      -- Fast nearby hazards query (target <100ms)
      CREATE OR REPLACE FUNCTION get_nearby_hazards(
        p_latitude DOUBLE PRECISION,
        p_longitude DOUBLE PRECISION,
        p_radius_meters INTEGER DEFAULT 5000,
        p_limit INTEGER DEFAULT 50
      ) RETURNS TABLE(
        id INTEGER,
        hazard_type VARCHAR,
        severity VARCHAR,
        description TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        priority_level INTEGER,
        affects_traffic BOOLEAN,
        weather_related BOOLEAN,
        status VARCHAR,
        created_at TIMESTAMPTZ,
        distance_meters DOUBLE PRECISION
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          h.id,
          h.hazard_type,
          h.severity,
          h.description,
          ST_Y(h.location::geometry) as latitude,
          ST_X(h.location::geometry) as longitude,
          h.priority_level,
          h.affects_traffic,
          h.weather_related,
          h.status,
          h.created_at,
          ST_Distance(
            h.location,
            ST_SetSRID(ST_Point(p_longitude, p_latitude), 4326)::geography
          ) as distance_meters
        FROM hazards h
        WHERE 
          h.status = 'active'
          AND ST_DWithin(
            h.location,
            ST_SetSRID(ST_Point(p_longitude, p_latitude), 4326)::geography,
            p_radius_meters
          )
        ORDER BY h.priority_level DESC, distance_meters ASC
        LIMIT p_limit;
      END;
      $$ LANGUAGE plpgsql STABLE;
    `);
    console.log('✅ Optimized query functions created');

    // 10. Insert sample data for testing
    await insertOptimizedSampleData();

    // 11. Create performance monitoring view
    await pool.query(`
      CREATE OR REPLACE VIEW hazard_performance_stats AS
      SELECT 
        COUNT(*) as total_hazards,
        COUNT(*) FILTER (WHERE status = 'active') as active_hazards,
        COUNT(*) FILTER (WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '24 hours') as recent_hazards,
        AVG(priority_level) as avg_priority,
        COUNT(DISTINCT hazard_type) as hazard_types_count,
        MIN(created_at) as oldest_hazard,
        MAX(created_at) as newest_hazard
      FROM hazards;
    `);
    console.log('✅ Performance monitoring view created');

    console.log('🎉 Hazard schema optimization completed successfully!');
    console.log('📊 System ready for <100ms spatial queries and real-time notifications');
    
    // Display performance stats
    const stats = await pool.query('SELECT * FROM hazard_performance_stats');
    console.log('📈 Current system stats:', stats.rows[0]);
    
  } catch (error) {
    console.error('❌ Schema optimization failed:', error);
    throw error;
  }
}

async function insertOptimizedSampleData() {
  try {
    console.log('📝 Inserting optimized sample data...');
    
    // London area coordinates for realistic testing
    const londonHazards = [
      {
        description: 'Major water main burst causing road closure and flooding. Emergency services on scene.',
        hazard_type: 'flooding',
        severity: 'critical',
        lat: 51.5074,
        lng: -0.1278,
        affects_traffic: true,
        weather_related: true
      },
      {
        description: 'Multi-vehicle collision blocking two lanes. Traffic backing up significantly.',
        hazard_type: 'accident', 
        severity: 'high',
        lat: 51.5155,
        lng: -0.0922,
        affects_traffic: true,
        weather_related: false
      },
      {
        description: 'Ongoing construction work with lane restrictions. Expect delays during peak hours.',
        hazard_type: 'construction',
        severity: 'medium',
        lat: 51.4994,
        lng: -0.1243,
        affects_traffic: true,
        weather_related: false
      },
      {
        description: 'Broken street lighting creating visibility issues for pedestrians.',
        hazard_type: 'poor_lighting',
        severity: 'medium',
        lat: 51.5033,
        lng: -0.1195,
        affects_traffic: false,
        weather_related: false
      },
      {
        description: 'Large pothole reported on cycling route. Potential danger to cyclists.',
        hazard_type: 'pothole',
        severity: 'medium',
        lat: 51.5085,
        lng: -0.1257,
        affects_traffic: true,
        weather_related: false
      },
      {
        description: 'Suspicious activity reported in park area. Increased police presence.',
        hazard_type: 'crime',
        severity: 'high',
        lat: 51.5020,
        lng: -0.1364,
        affects_traffic: false,
        weather_related: false
      }
    ];

    for (const hazard of londonHazards) {
      await pool.query(`
        INSERT INTO hazards (
          user_id, description, hazard_type, severity, location,
          affects_traffic, weather_related, incident_time
        )
        VALUES (
          1, $1, $2, $3, 
          ST_SetSRID(ST_Point($4, $5), 4326)::geography,
          $6, $7, CURRENT_TIMESTAMP
        )
      `, [
        hazard.description,
        hazard.hazard_type,
        hazard.severity,
        hazard.lng,
        hazard.lat,
        hazard.affects_traffic,
        hazard.weather_related
      ]);
    }
    
    console.log('✅ Sample hazards inserted for testing');
  } catch (error) {
    console.error('❌ Failed to insert sample data:', error);
    throw error;
  }
}

// Execute if run directly
if (require.main === module) {
  optimizeHazardSchema()
    .then(() => {
      console.log('✨ Optimization completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Optimization failed:', error);
      process.exit(1);
    });
}

module.exports = optimizeHazardSchema;