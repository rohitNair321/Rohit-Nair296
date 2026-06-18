// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const IS_DEMO = process.env.DEMO_MODE === 'true';

// In demo mode we only scan the demo router — it has full, example-rich docs.
// In production mode we scan the real v1 route files.
const apis = IS_DEMO
  ? [
      path.join(__dirname, '../demo/demoRouter.js'),
      path.join(__dirname, '../server.js'),         // /health + /api/health/db docs
    ]
  : [
      path.join(__dirname, '../api/v1/**/*.routes.js'),
      path.join(__dirname, '../routes/**/*.js'),
      path.join(__dirname, '../server.js'),
    ];

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Boilerplate Backend API',
      version: '2.0.0',
      description: `## Angular Boilerplate — Backend API

${IS_DEMO
  ? `> **DEMO MODE** — running with dummy data. No database or API key required.
>
> **Quick start:**
> 1. \`POST /api/auth/login\` — body \`{"email":"admin@demo.com","password":"admin123"}\`
> 2. Copy the \`token\` from the response.
> 3. Click **Authorize** (lock icon) and paste \`<token>\` — all admin routes unlock.
>
> **When you are ready for real data:** set \`DEMO_MODE=false\` in \`.env\`,
> add your Supabase + OpenAI credentials, and restart.`
  : `> **PRODUCTION MODE** — requests hit a real Supabase database.
>
> Authenticate via \`POST /api/v1/auth/login\`, copy the JWT, and click **Authorize**.`
}

### Frontend wiring points
Every endpoint description notes which mock \`of()\` block in the Angular service
to replace when switching from demo data to real API calls.

| Angular service | Replace \`of()\` calls in |
|---|---|
| \`AppService\` | \`getProfile()\`, \`getNotifications()\`, \`updateProfile()\`, \`aiChat()\` |
| \`AuthService\` | \`login()\`, \`logout()\`, \`forgotPassword()\`, \`resetPassword()\` |
| \`ChatApiService\` | \`getSessions()\`, \`getSession()\`, \`deleteSession()\`, \`getBalance()\`, \`getUsage()\` |
`,
      contact: {
        name: 'Developer Support',
        email: process.env.CONTACT_EMAIL || 'support@example.com',
      },
      license: { name: 'MIT' },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: IS_DEMO ? 'Demo server (dummy data)' : 'API server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Obtain a token from POST /api/auth/login, then paste it here.',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'HttpOnly cookie set automatically after login.',
        },
      },

      // ── Reusable schemas ───────────────────────────────────────────────────
      schemas: {

        // Generic envelope
        ApiSuccess: {
          type: 'object',
          properties: {
            success:   { type: 'boolean', example: true },
            statusCode:{ type: 'integer', example: 200 },
            message:   { type: 'string',  example: 'Success' },
            data:      { type: 'object',  nullable: true },
            timestamp: { type: 'string',  format: 'date-time' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success:   { type: 'boolean', example: false },
            statusCode:{ type: 'integer', example: 400 },
            message:   { type: 'string',  example: 'Error message' },
            timestamp: { type: 'string',  format: 'date-time' },
          },
        },

        // ── Profile ────────────────────────────────────────────────────────
        Project: {
          type: 'object',
          properties: {
            name:        { type: 'string',  example: 'Design System Migration' },
            description: { type: 'string',  example: 'Rebuilt the component library with PrimeNG.' },
            techStack:   { type: 'array',   items: { type: 'string' }, example: ['Angular 19', 'PrimeNG'] },
            link:        { type: 'string',  nullable: true },
            highlights:  { type: 'array',   items: { type: 'string' }, example: ['Reduced bundle size by 40%'] },
          },
        },
        Experience: {
          type: 'object',
          required: ['role', 'company', 'startDate'],
          properties: {
            role:        { type: 'string',  example: 'Senior Frontend Engineer' },
            company:     { type: 'string',  example: 'TechCorp Inc.' },
            startDate:   { type: 'string',  example: '2022-03' },
            endDate:     { type: 'string',  nullable: true, example: null },
            present:     { type: 'boolean', example: true },
            description: { type: 'string',  example: 'Led frontend architecture for a SaaS platform.' },
            projects: {
              type: 'array',
              items: { '$ref': '#/components/schemas/Project' },
            },
          },
        },
        ThemeTokens: {
          type: 'object',
          description: 'CSS custom property values for one light or dark variant',
          properties: {
            primary:         { type: 'string', example: '#4A90D9' },
            accent:          { type: 'string', example: '#7B68EE' },
            primary_glow:    { type: 'string', example: 'rgba(74,144,217,0.16)' },
            background:      { type: 'string', example: '#F8FAFC' },
            surface:         { type: 'string', example: '#FFFFFF' },
            surface_alt:     { type: 'string', example: '#F1F5F9' },
            text_primary:    { type: 'string', example: '#0F172A' },
            text_secondary:  { type: 'string', example: '#475569' },
            text_muted:      { type: 'string', example: '#94A3B8' },
            border:          { type: 'string', example: '#E2E8F0' },
            success:         { type: 'string', example: '#22C55E' },
            warning:         { type: 'string', example: '#F59E0B' },
            error:           { type: 'string', example: '#EF4444' },
          },
        },
        ThemeDefinition: {
          type: 'object',
          required: ['id', 'name', 'tokens'],
          properties: {
            id:          { type: 'string',  example: 'golden-hour' },
            name:        { type: 'string',  example: 'Golden Hour' },
            tokens:      { '$ref': '#/components/schemas/ThemeTokens' },
            dark_tokens: { '$ref': '#/components/schemas/ThemeTokens' },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            id:             { type: 'string',  example: 'demo-user-001' },
            full_name:      { type: 'string',  example: 'Alex Johnson' },
            description:    { type: 'string',  example: 'Full-stack developer…' },
            email:          { type: 'string',  format: 'email', example: 'alex@demo.com' },
            primary_phone:  { type: 'string',  example: '+1 (555) 123-4567', nullable: true },
            secondary_phone:{ type: 'string',  nullable: true },
            logo_initials:  { type: 'string',  example: 'AJ', maxLength: 3 },
            location:       { type: 'string',  example: 'San Francisco, CA' },
            website:        { type: 'string',  example: 'https://alexjohnson.dev' },
            linkedin:       { type: 'string',  example: 'https://linkedin.com/in/alexjohnson' },
            github:         { type: 'string',  example: 'https://github.com/alexjohnson' },
            open_to_work:   { type: 'boolean', example: true },
            skills:         { type: 'array',   items: { type: 'string' }, example: ['Angular', 'TypeScript', 'Node.js'] },
            experiences: {
              type: 'array',
              items: { '$ref': '#/components/schemas/Experience' },
            },
            currenttheme:   { type: 'string',  example: 'boilerplate' },
            themes: {
              type: 'array',
              items: { '$ref': '#/components/schemas/ThemeDefinition' },
            },
            avatar_url:     { type: 'string',  nullable: true, example: null },
            resume_url:     { type: 'string',  nullable: true, example: 'assets/Rohit.Nair.pdf' },
            projectCount:   { type: 'integer', example: 3, description: 'Computed — total projects across all experiences' },
            companyCount:   { type: 'integer', example: 2, description: 'Computed — number of experience entries' },
            currentCompany: { type: 'string',  nullable: true, example: 'TechCorp Inc.', description: 'Computed — company where present=true' },
            created_at:     { type: 'string',  format: 'date-time' },
            updated_at:     { type: 'string',  format: 'date-time' },
          },
        },

        // ── Notifications ──────────────────────────────────────────────────
        NotificationItem: {
          type: 'object',
          properties: {
            id:         { type: 'string',  example: 'notif-001' },
            first_name: { type: 'string',  example: 'Sarah' },
            last_name:  { type: 'string',  example: 'Chen' },
            email:      { type: 'string',  format: 'email', example: 'sarah@example.com' },
            message:    { type: 'string',  example: 'Would love to know if you offer consulting!' },
            is_read:    { type: 'boolean', example: false },
            created_at: { type: 'string',  format: 'date-time' },
          },
        },
        NotificationResponse: {
          type: 'object',
          properties: {
            success:      { type: 'string',  example: 'ok' },
            unreadCount:  { type: 'integer', example: 3 },
            notificationList: {
              type: 'array',
              items: { '$ref': '#/components/schemas/NotificationItem' },
            },
          },
        },

        // ── Chat ──────────────────────────────────────────────────────────
        ChatMessage: {
          type: 'object',
          properties: {
            sender: { type: 'string', enum: ['user', 'bot'], example: 'user' },
            text:   { type: 'string', example: 'How does the theming system work?' },
            time:   { type: 'string', format: 'date-time' },
          },
        },
        ChatSession: {
          type: 'object',
          properties: {
            id:         { type: 'string', example: 'seed-session-001' },
            title:      { type: 'string', example: 'How does the theming system work?' },
            model:      { type: 'string', example: 'v2.5s' },
            user_id:    { type: 'string', nullable: true, example: 'demo-user-001' },
            messages: {
              type: 'array',
              items: { '$ref': '#/components/schemas/ChatMessage' },
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },

        // ── AI Usage ──────────────────────────────────────────────────────
        UsageSummary: {
          type: 'object',
          properties: {
            totalTokens:  { type: 'integer', example: 284500 },
            inputTokens:  { type: 'integer', example: 198200 },
            outputTokens: { type: 'integer', example: 86300 },
            totalCost:    { type: 'number',  example: 4.27 },
          },
        },
        UsageTrend: {
          type: 'object',
          properties: {
            date:         { type: 'string',  example: '2025-06-11' },
            tokens:       { type: 'integer', example: 18400 },
            inputTokens:  { type: 'integer', example: 12900 },
            outputTokens: { type: 'integer', example: 5500 },
            cost:         { type: 'number',  example: 0.276 },
            requests:     { type: 'integer', example: 42 },
          },
        },
        ModelBreakdown: {
          type: 'object',
          properties: {
            model:        { type: 'string',  example: 'AiNg v2.5 Stable' },
            totalTokens:  { type: 'integer', example: 142000 },
            inputTokens:  { type: 'integer', example: 99000 },
            outputTokens: { type: 'integer', example: 43000 },
            cost:         { type: 'number',  example: 2.13 },
            requests:     { type: 'integer', example: 312 },
          },
        },
        UsageResponse: {
          type: 'object',
          properties: {
            summary:  { '$ref': '#/components/schemas/UsageSummary' },
            trend: {
              type: 'array',
              items: { '$ref': '#/components/schemas/UsageTrend' },
            },
            byModel: {
              type: 'array',
              items: { '$ref': '#/components/schemas/ModelBreakdown' },
            },
            byRole: {
              type: 'object',
              properties: {
                admin: { '$ref': '#/components/schemas/UsageSummary' },
                guest: { '$ref': '#/components/schemas/UsageSummary' },
              },
            },
            sessions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sessionId:    { type: 'string' },
                  date:         { type: 'string' },
                  totalTokens:  { type: 'integer' },
                  inputTokens:  { type: 'integer' },
                  outputTokens: { type: 'integer' },
                  cost:         { type: 'number' },
                  requests:     { type: 'integer' },
                  model:        { type: 'string' },
                },
              },
            },
            allTime: {
              type: 'object',
              properties: {
                totalTokens:   { type: 'integer', example: 284500 },
                inputTokens:   { type: 'integer', example: 198200 },
                outputTokens:  { type: 'integer', example: 86300 },
                totalRequests: { type: 'integer', example: 644 },
                totalCost:     { type: 'number',  example: 4.27 },
              },
            },
          },
        },
        BalanceResponse: {
          type: 'object',
          properties: {
            source:       { type: 'string', enum: ['openai', 'supabase'], example: 'openai' },
            totalUsedUSD: { type: 'number', example: 4.27 },
            hardLimitUSD: { type: 'number', nullable: true, example: 20.0 },
            remainingUSD: { type: 'number', nullable: true, example: 15.73 },
            remainingPct: { type: 'number', nullable: true, example: 78.65 },
          },
        },

        // ── Analytics ─────────────────────────────────────────────────────
        AnalyticsDashboard: {
          type: 'object',
          properties: {
            pageViews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date:      { type: 'string', example: '20250611' },
                  pageViews: { type: 'integer', example: 127 },
                  sessions:  { type: 'integer', example: 89 },
                },
              },
            },
            visitorStats: {
              type: 'object',
              properties: {
                totalUsers:         { type: 'integer', example: 1247 },
                newUsers:           { type: 'integer', example: 856 },
                activeUsers:        { type: 'integer', example: 423 },
                sessions:           { type: 'integer', example: 1580 },
                avgSessionDuration: { type: 'number',  example: 185.5 },
                bounceRate:         { type: 'number',  example: 0.42 },
              },
            },
            geographic: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  country:  { type: 'string',  example: 'United States' },
                  city:     { type: 'string',  example: 'New York' },
                  users:    { type: 'integer', example: 245 },
                  sessions: { type: 'integer', example: 380 },
                },
              },
            },
            devices: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  device:   { type: 'string', example: 'desktop' },
                  os:       { type: 'string', example: 'Windows' },
                  users:    { type: 'integer' },
                  sessions: { type: 'integer' },
                },
              },
            },
            traffic: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  source:   { type: 'string', example: 'google' },
                  medium:   { type: 'string', example: 'organic' },
                  sessions: { type: 'integer' },
                  users:    { type: 'integer' },
                },
              },
            },
            topPages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path:        { type: 'string', example: '/' },
                  title:       { type: 'string', example: 'Home' },
                  pageViews:   { type: 'integer', example: 1250 },
                  avgDuration: { type: 'number',  example: 145.5 },
                },
              },
            },
            dateRange: {
              type: 'object',
              properties: {
                startDate: { type: 'string', example: '7daysAgo' },
                endDate:   { type: 'string', example: 'today' },
              },
            },
            isMockData: { type: 'boolean', example: false },
          },
        },

        // ── Posts ─────────────────────────────────────────────────────────
        Post: {
          type: 'object',
          properties: {
            id:              { type: 'string', example: 'post-001' },
            title:           { type: 'string', example: 'Building a Token-Driven Theme Engine in Angular 19' },
            slug:            { type: 'string', example: 'token-driven-theme-engine-angular' },
            excerpt:         { type: 'string', nullable: true },
            content:         { type: 'string', description: 'HTML from rich editor' },
            content_raw:     { type: 'string', description: 'Plain text version', nullable: true },
            status:          { type: 'string', enum: ['draft', 'published', 'archived'], example: 'published' },
            is_featured:     { type: 'boolean', example: true },
            week_number:     { type: 'integer', nullable: true, example: 12 },
            tags:            { type: 'array', items: { type: 'string' }, example: ['Angular', 'CSS'] },
            cover_image_url: { type: 'string', nullable: true },
            linkedin_url:    { type: 'string', nullable: true },
            seo_title:       { type: 'string', nullable: true },
            seo_description: { type: 'string', nullable: true },
            og_image_url:    { type: 'string', nullable: true },
            view_count:      { type: 'integer', example: 1480 },
            impressions:     { type: 'integer', example: 8200 },
            author_id:       { type: 'string' },
            created_at:      { type: 'string', format: 'date-time' },
            updated_at:      { type: 'string', format: 'date-time' },
          },
        },

      }, // end schemas
    }, // end components

    tags: [
      { name: 'Auth',      description: 'Authentication and password management' },
      { name: 'Profile',   description: 'Portfolio profile — public read + admin write' },
      { name: 'Contact',   description: 'Contact form and admin notification inbox' },
      { name: 'Chat',      description: 'AI chat widget — sessions, messages, usage stats' },
      { name: 'Analytics', description: 'Google Analytics 4 dashboard data (admin only)' },
      { name: 'Posts',     description: 'Blog / LinkedIn learning post management' },
      { name: 'Health',    description: 'Server and database liveness checks' },
    ],
  },
  apis,
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
