// server.js
require('dotenv').config();

const IS_DEMO = process.env.DEMO_MODE === 'true';

// ============================================
// STARTUP ENV VALIDATION  (skipped in DEMO_MODE)
// ============================================
if (!IS_DEMO) {
  const REQUIRED_ENV = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'PROFILE_OWNER_ID',
    'OPENAI_API_KEY',
  ];
  const missingEnv = REQUIRED_ENV.filter(k => !process.env[k]);
  if (missingEnv.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingEnv.join(', ')}`);
    console.error('   Add them to your .env file. See .env.example for reference.');
    console.error('   Tip: set DEMO_MODE=true to start without any external services.');
    process.exit(1);
  }
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters for security');
    process.exit(1);
  }
}

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const { xss }      = require('express-xss-sanitizer');
const cookieParser = require('cookie-parser');
const swaggerUi    = require('swagger-ui-express');

const logger       = require('./config/logger');
const swaggerDocs  = require('./config/swagger');
const { HTTP_STATUS } = require('./config/constants');
const requestLogger   = require('./middleware/requestLogger');
const { apiLimiter }  = require('./middleware/rateLimiter');
const {
  errorConverter,
  errorHandler,
  notFound,
} = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet());
app.set('trust proxy', 1);

// ============================================
// CORS
// ============================================
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .concat([
    'http://localhost:4200',
    'http://localhost:3000',
    'https://rohitnair321.github.io',
    'https://rohit-nair296.onrender.com',
    'https://portfolio-backend-bpmw.onrender.com',
    'https://www.mintpixel.in',
  ]);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (IS_DEMO || allowedOrigins.includes(origin)) return callback(null, true);
    logger.warn('CORS blocked request from origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ============================================
// BODY PARSING & SANITIZATION
// ============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(xss());

// ============================================
// LOGGING
// ============================================
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// ============================================
// API DOCUMENTATION (Swagger)
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Boilerplate Backend API Docs',
}));

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Server liveness check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:   { type: boolean, example: true }
 *                 message:   { type: string,  example: Server is running }
 *                 uptime:    { type: number,  example: 3600.5 }
 *                 demo:      { type: boolean, example: true }
 *                 timestamp: { type: string,  format: date-time }
 */
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: 'Server is running',
    demo: IS_DEMO,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /api/health/db:
 *   get:
 *     summary: Database connectivity check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:   { type: boolean }
 *                 message:   { type: string }
 *                 demo:      { type: boolean }
 *                 timestamp: { type: string, format: date-time }
 */
app.get('/api/health/db', async (req, res) => {
  if (IS_DEMO) {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'DEMO_MODE — no database connected',
      demo: true,
      timestamp: new Date().toISOString(),
    });
  }
  try {
    const { testConnection } = require('./config/database');
    const isConnected = await testConnection();
    if (!isConnected) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
      });
    }
    res.status(HTTP_STATUS.OK).json({
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Database connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Database health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// ============================================
// API ROUTES
// ============================================

if (IS_DEMO) {
  // ── DEMO MODE ──────────────────────────────────────────────────────────────
  // All /api/* routes are handled by the demo router which returns static dummy
  // data. No database or external service needed. Ideal for first-time setup.
  logger.warn('⚠️  DEMO_MODE=true — all API routes return dummy data');
  logger.info('   Demo login: admin@demo.com / admin123');
  logger.info('   Swap to real data: set DEMO_MODE=false and fill in Supabase + OpenAI vars');

  app.use('/api', require('./demo/demoRouter'));

} else {
  // ── PRODUCTION MODE ────────────────────────────────────────────────────────
  // Real routes backed by Supabase + OpenAI. All imports are lazy so missing
  // env vars in demo mode do not trigger module-load errors.

  const apiV1Routes      = require('./api/v1');
  const oldAuthRoutes    = require('./routes/authRoutes');
  const oldProfileRoutes = require('./routes/profileRoutes');
  const oldContactRoutes = require('./routes/contactRoutes');
  const { supabase }     = require('./db/supabaseClient');
  const { testConnection } = require('./config/database');

  // v1 canonical routes
  app.use('/api/v1', apiLimiter, apiV1Routes);

  // Legacy routes (kept for backward compatibility — frontend may still call these)
  app.use('/api/auth',    oldAuthRoutes);
  app.use('/api/profile', oldProfileRoutes);
  app.use('/api/contact', oldContactRoutes);

  // Sitemap (generated from published posts in Supabase)
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('status', 'published');

      const baseUrl = process.env.SITE_URL || 'https://www.mintpixel.in';
      const urls = (posts || []).map(p => `
    <url>
      <loc>${baseUrl}/posts/${p.slug}</loc>
      <lastmod>${(p.updated_at || '').split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`).join('');

      res.header('Content-Type', 'application/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`);
    } catch (err) {
      logger.error('Sitemap generation failed:', err);
      res.status(500).send('Sitemap generation failed');
    }
  });

  // Test DB on startup
  testConnection().catch(err => logger.error('DB connection test failed:', err));
}

// ============================================
// ERROR HANDLING (must be after all routes)
// ============================================
app.use(notFound);
app.use(errorConverter);
app.use(errorHandler);

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
function shutdown(signal) {
  logger.info(`${signal} received: closing HTTP server`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => process.exit(1));
});

// ============================================
// START
// ============================================
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info('='.repeat(50));
  logger.info(`✅ Server started`);
  logger.info(`🚀 Environment : ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🎭 Demo mode   : ${IS_DEMO}`);
  logger.info(`📍 Port        : ${PORT}`);
  logger.info(`📚 API Docs    : http://localhost:${PORT}/api-docs`);
  logger.info(`🏥 Health      : http://localhost:${PORT}/health`);
  if (!IS_DEMO) logger.info(`🔧 API v1      : http://localhost:${PORT}/api/v1`);
  logger.info('='.repeat(50));
});

module.exports = app;
