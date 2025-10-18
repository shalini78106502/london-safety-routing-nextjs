const pool = require('../config/database');

async function migrateDatabase() {
  try {
    console.log('🔧 Running database migrations...');

    // Add new columns to existing users table
    const migrations = [
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(50);',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_transport VARCHAR(50) DEFAULT \'walking\';',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS safety_priority VARCHAR(50) DEFAULT \'high\';',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS notifications BOOLEAN DEFAULT true;'
    ];

    for (const migration of migrations) {
      try {
        await pool.query(migration);
        console.log('✅ Migration applied:', migration.split('ADD COLUMN IF NOT EXISTS')[1]?.split(' ')[0] || 'column');
      } catch (error) {
        if (error.code === '42701') {
          // Column already exists, skip
          console.log('⚠️ Column already exists, skipping...');
        } else {
          throw error;
        }
      }
    }
    
    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
if (require.main === module) {
  migrateDatabase();
}

module.exports = migrateDatabase;