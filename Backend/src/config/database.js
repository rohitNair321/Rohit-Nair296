// config/database.js
const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

const supabaseUrl          = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const IS_DEMO              = process.env.DEMO_MODE === 'true';

if (!IS_DEMO && (!supabaseUrl || !supabaseServiceRoleKey)) {
  logger.error('❌ Missing Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
  logger.error('   Set DEMO_MODE=true in .env to start without a database.');
  process.exit(1);
}

// In DEMO_MODE the supabase client is null — controllers are never called.
const supabase = (!IS_DEMO && supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Client-Info': 'portfolio-backend',
        },
      },
    })
  : null;

/**
 * Test database connection (no-op in DEMO_MODE)
 */
async function testConnection() {
  if (IS_DEMO) {
    logger.info('🎭 DEMO_MODE — skipping database connection test');
    return true;
  }
  try {
    logger.info('🔍 Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      logger.error('❌ Supabase connection error:', error.message);
      return false;
    }
    logger.info('✅ Supabase connected successfully');
    return true;
  } catch (err) {
    logger.error('🔥 Supabase network failure:', err.message);
    return false;
  }
}

module.exports = {
  supabase,
  testConnection,
};
