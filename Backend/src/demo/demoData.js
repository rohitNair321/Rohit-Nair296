// demo/demoData.js
// All dummy data matching the exact shapes the Angular frontend expects.
// Mirrors src/app/core/mock-data/mock-data.ts + the TypeScript interfaces in app.service.ts / chat-api.service.ts

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_ADMIN_EMAIL    = 'admin@demo.com';
const DEMO_ADMIN_PASSWORD = 'admin123';

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE  (matches Profile interface in app.service.ts)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_PROFILE = {
  id: 'demo-user-001',
  full_name: 'Alex Johnson',
  description: 'Full-stack developer passionate about clean architecture, great UX, and developer tooling.',
  email: 'alex@demo.com',
  primary_phone: '+1 (555) 123-4567',
  secondary_phone: null,
  logo_initials: 'AJ',
  location: 'San Francisco, CA',
  website: 'https://alexjohnson.dev',
  linkedin: 'https://linkedin.com/in/alexjohnson',
  github: 'https://github.com/alexjohnson',
  open_to_work: true,
  skills: ['Angular', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'RxJS', 'SCSS'],
  experiences: [
    {
      role: 'Senior Frontend Engineer',
      company: 'TechCorp Inc.',
      startDate: '2022-03',
      present: true,
      description: 'Lead frontend architecture for a SaaS platform serving 50k+ users. Migrated codebase from Angular 12 to 19 with signals.',
      projects: [
        {
          name: 'Design System Migration',
          description: 'Rebuilt the component library from scratch using PrimeNG and token-driven theming.',
          techStack: ['Angular 19', 'PrimeNG', 'SCSS', 'Storybook'],
          highlights: ['Reduced bundle size by 40%', 'Cut design inconsistencies by 90%'],
        },
        {
          name: 'Real-time Dashboard',
          description: 'Built a live analytics dashboard with WebSocket integration and Highcharts.',
          techStack: ['Angular', 'Highcharts', 'WebSockets', 'RxJS'],
          highlights: ['Sub-200ms render time', 'Handles 10k concurrent users'],
        },
      ],
    },
    {
      role: 'Frontend Developer',
      company: 'StartupXYZ',
      startDate: '2020-06',
      endDate: '2022-02',
      description: 'Built MVP from ground up. Sole frontend developer responsible for all UI work.',
      projects: [
        {
          name: 'Customer Portal',
          description: 'End-to-end customer portal with authentication, billing, and reporting.',
          techStack: ['Angular', 'Stripe', 'Node.js'],
        },
      ],
    },
  ],
  currenttheme: 'boilerplate',
  themes: [],
  avatar_url: '',
  resume_url: 'assets/Rohit.Nair.pdf',
  projectCount: 3,
  companyCount: 2,
  currentCompany: 'TechCorp Inc.',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-11-01T14:30:00Z',
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS  (matches Notification interface in app.service.ts)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_NOTIFICATIONS = {
  success: 'ok',
  unreadCount: 3,
  notificationList: [
    {
      id: 'notif-001',
      first_name: 'Sarah',
      last_name: 'Chen',
      email: 'sarah.chen@example.com',
      message: "Hi! I came across your boilerplate and I'm really impressed with the theming system. Would love to know if you offer consulting for Angular projects?",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'notif-002',
      first_name: 'Marcus',
      last_name: 'Webb',
      email: 'marcus@webagency.io',
      message: 'Excellent work on the SSR setup and PrimeNG integration. We are evaluating this for our client\'s enterprise portal. Can we schedule a quick call?',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'notif-003',
      first_name: 'Priya',
      last_name: 'Sharma',
      email: 'priya.sharma@techlab.in',
      message: 'Love the signal-based architecture! Just forked the repo. One question — how do I add a new custom theme without touching the theme service?',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'notif-004',
      first_name: 'Jordan',
      last_name: 'Park',
      email: 'jordan@devharbor.com',
      message: 'The responsive layout shell is exactly what I was looking for. Saved me weeks of setup time. Thank you for open-sourcing this!',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'notif-005',
      first_name: 'Lena',
      last_name: 'Müller',
      email: 'lena.muller@digitalagency.de',
      message: 'We are using this boilerplate as the foundation for a large-scale Angular app. The theme engine and the admin layout are both excellent. Any plans to add Tailwind support?',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAT SESSIONS  (matches ChatSessionDto in chat-api.service.ts)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_CHAT_SESSIONS = [
  {
    id: 'seed-session-001',
    title: 'How does the theming system work?',
    model: 'v2.5s',
    user_id: 'demo-user-001',
    messages: [
      { sender: 'user', text: 'How does the theming system work?', time: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
      { sender: 'bot',  text: 'This boilerplate uses a **token-driven theming system** where every colour is a CSS custom property. You can switch themes at runtime without any page reload by calling `themeService.setTheme(id)`.', time: new Date(Date.now() - 1000 * 60 * 9).toISOString() },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
  },
  {
    id: 'seed-session-002',
    title: 'How do I add a new route?',
    model: 'v1.5s',
    user_id: 'demo-user-001',
    messages: [
      { sender: 'user', text: 'How do I add a new route to the app?', time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { sender: 'bot',  text: 'Open `src/app/app.routes.ts` and add a new entry to the `routes` array. Use `loadComponent` for lazy loading. If the route should be admin-only, nest it under the `/admin` path which has the `tokenGuard` applied.', time: new Date(Date.now() - 1000 * 60 * 60 * 2 + 30000).toISOString() },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2 + 30000).toISOString(),
  },
];

const BOT_REPLIES = [
  "This boilerplate uses a **token-driven theming system** where every colour is a CSS custom property. Switch themes at runtime via `themeService.setTheme(id)`.",
  "The layout shell supports two modes: **sidebar** and **navbar**. Toggle between them in the preferences panel (gear icon on the right edge). It collapses to off-canvas on mobile automatically.",
  "Angular 19 **Signals** are used for all reactive state. They replace Zone.js-driven change detection, giving you faster rendering and more predictable data flow.",
  "To add a new theme, call `themeService.registerThemes([...])` with an array of `ThemeDefinition` objects. Each theme needs `id`, `name`, `tokens` (light), and optionally `dark_tokens`.",
  "The **PrimeNG** integration uses the Aura preset. Every PrimeNG component inherits from the active theme tokens, so switching themes updates the whole UI.",
  "Authentication in the demo uses `admin@demo.com` / `admin123` to log in as admin. Any other credentials log you in as a guest. No real backend required to explore.",
  "The chat widget persists sessions in **localStorage**. You can start multiple conversations, switch between them from the history panel, or delete sessions individually.",
];

// ─────────────────────────────────────────────────────────────────────────────
// AI USAGE  (matches UsageResponse in chat-api.service.ts)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_USAGE = {
  summary: {
    totalTokens: 284500,
    inputTokens: 198200,
    outputTokens: 86300,
    totalCost: 4.27,
  },
  trend: Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toISOString().slice(0, 10),
      tokens: Math.floor(Math.random() * 25000) + 5000,
      inputTokens: Math.floor(Math.random() * 18000) + 3000,
      outputTokens: Math.floor(Math.random() * 8000) + 1000,
      cost: parseFloat((Math.random() * 0.5).toFixed(4)),
      requests: Math.floor(Math.random() * 80) + 10,
    };
  }),
  byModel: [
    { model: 'AiNg v2.5 Stable', totalTokens: 142000, inputTokens: 99000,  outputTokens: 43000, cost: 2.13, requests: 312 },
    { model: 'AiNg v1.5 Stable', totalTokens: 98500,  inputTokens: 68900,  outputTokens: 29600, cost: 1.48, requests: 228 },
    { model: 'AiNg v1.5 Beta',   totalTokens: 44000,  inputTokens: 30300,  outputTokens: 13700, cost: 0.66, requests: 104 },
  ],
  byRole: {
    admin: { totalTokens: 185000, inputTokens: 129500, outputTokens: 55500, cost: 2.78, requests: 430 },
    guest: { totalTokens: 99500,  inputTokens: 68700,  outputTokens: 30800, cost: 1.49, requests: 214 },
  },
  sessions: Array.from({ length: 8 }, (_, i) => ({
    sessionId: `sess-${String(i + 1).padStart(3, '0')}`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    totalTokens: Math.floor(Math.random() * 40000) + 5000,
    inputTokens: Math.floor(Math.random() * 28000) + 3500,
    outputTokens: Math.floor(Math.random() * 12000) + 1500,
    cost: parseFloat((Math.random() * 0.6).toFixed(4)),
    requests: Math.floor(Math.random() * 60) + 5,
    model: ['AiNg v2.5 Stable', 'AiNg v1.5 Stable', 'AiNg v1.5 Beta'][i % 3],
  })),
  allTime: {
    totalTokens: 284500,
    inputTokens: 198200,
    outputTokens: 86300,
    totalRequests: 644,
    totalCost: 4.27,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BALANCE  (matches BalanceResponse in chat-api.service.ts)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_BALANCE = {
  source: 'openai',
  totalUsedUSD: 4.27,
  hardLimitUSD: 20.00,
  remainingUSD: 15.73,
  remainingPct: 78.65,
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAT STATS (admin dashboard)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_CHAT_STATS = {
  totalSessions: 38,
  totalMessages: 224,
  adminSessions: 12,
  guestSessions: 26,
  avgMessagesPerSession: 5.9,
  topQuestions: [
    { question: 'How does the theming system work?', count: 14 },
    { question: 'How do I add a new route?', count: 9 },
    { question: 'What is the admin login?', count: 7 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS  (matches analyticsService.getMockDashboardData() shape)
// ─────────────────────────────────────────────────────────────────────────────

function buildPageViews(days = 7) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0].replace(/-/g, '');
    result.push({
      date: dateStr,
      pageViews: Math.floor(Math.random() * 100) + 50,
      sessions: Math.floor(Math.random() * 80) + 30,
    });
  }
  return result;
}

const DEMO_ANALYTICS_DASHBOARD = {
  pageViews: buildPageViews(7),
  visitorStats: {
    totalUsers: 1247,
    newUsers: 856,
    activeUsers: 423,
    sessions: 1580,
    avgSessionDuration: 185.5,
    bounceRate: 0.42,
  },
  geographic: [
    { country: 'United States', city: 'New York',    users: 245, sessions: 380 },
    { country: 'United Kingdom', city: 'London',     users: 156, sessions: 240 },
    { country: 'India',          city: 'Bangalore',  users: 189, sessions: 290 },
    { country: 'Germany',        city: 'Berlin',     users: 98,  sessions: 145 },
    { country: 'Canada',         city: 'Toronto',    users: 87,  sessions: 130 },
  ],
  devices: [
    { device: 'desktop', os: 'Windows', users: 580, sessions: 890 },
    { device: 'mobile',  os: 'Android', users: 420, sessions: 650 },
    { device: 'mobile',  os: 'iOS',     users: 247, sessions: 380 },
  ],
  traffic: [
    { source: 'google',   medium: 'organic',  sessions: 680, users: 450 },
    { source: 'direct',   medium: 'none',     sessions: 520, users: 380 },
    { source: 'linkedin', medium: 'social',   sessions: 280, users: 210 },
    { source: 'github',   medium: 'referral', sessions: 100, users: 67 },
  ],
  topPages: [
    { path: '/',         title: 'Home',     pageViews: 1250, avgDuration: 145.5 },
    { path: '/about',    title: 'About Me', pageViews: 680,  avgDuration: 220.3 },
    { path: '/projects', title: 'Projects', pageViews: 520,  avgDuration: 180.7 },
    { path: '/blog',     title: 'Blog',     pageViews: 340,  avgDuration: 260.1 },
  ],
  dateRange: { startDate: '7daysAgo', endDate: 'today' },
  isMockData: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// POSTS
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_POSTS = [
  {
    id: 'post-001',
    title: 'Building a Token-Driven Theme Engine in Angular 19',
    slug: 'token-driven-theme-engine-angular',
    excerpt: 'How I built a runtime theme switcher using CSS custom properties and Angular Signals — no page reload required.',
    content: '<p>Themes are CSS custom properties applied to <code>:root</code>. Angular Signals propagate changes instantly...</p>',
    content_raw: 'Themes are CSS custom properties applied to :root. Angular Signals propagate changes instantly...',
    status: 'published',
    is_featured: true,
    tags: ['Angular', 'CSS', 'Theming', 'Signals'],
    cover_image_url: null,
    linkedin_url: 'https://linkedin.com/posts/example-post-001',
    seo_title: 'Token-Driven Theming in Angular 19 | Boilerplate Guide',
    seo_description: 'Learn how to build a runtime theme switcher using CSS custom properties and Angular 19 Signals.',
    week_number: 12,
    view_count: 1480,
    impressions: 8200,
    author_id: 'demo-user-001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'post-002',
    title: 'Angular Signals vs RxJS: When to Use Each',
    slug: 'angular-signals-vs-rxjs',
    excerpt: 'Signals handle synchronous reactive state beautifully. RxJS wins for async streams. Here is how I use them together.',
    content: '<p>Signals are synchronous and simple. RxJS is powerful for event streams...</p>',
    content_raw: 'Signals are synchronous and simple. RxJS is powerful for event streams...',
    status: 'published',
    is_featured: true,
    tags: ['Angular', 'RxJS', 'Signals', 'State Management'],
    cover_image_url: null,
    linkedin_url: null,
    seo_title: 'Angular Signals vs RxJS — When to Use Each',
    seo_description: 'A practical guide to choosing between Angular Signals and RxJS for state management.',
    week_number: 11,
    view_count: 920,
    impressions: 5400,
    author_id: 'demo-user-001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17).toISOString(),
  },
  {
    id: 'post-003',
    title: 'Why I Chose PrimeNG Over Material for My Boilerplate',
    slug: 'primeng-vs-material-for-boilerplate',
    excerpt: 'PrimeNG\'s Aura preset and CSS variable system made theming trivial. Here\'s my full comparison.',
    content: '<p>After evaluating Angular Material, Ng-Zorro, and PrimeNG...</p>',
    content_raw: 'After evaluating Angular Material, Ng-Zorro, and PrimeNG...',
    status: 'draft',
    is_featured: false,
    tags: ['Angular', 'PrimeNG', 'UI Libraries'],
    cover_image_url: null,
    linkedin_url: null,
    seo_title: null,
    seo_description: null,
    week_number: 10,
    view_count: 0,
    impressions: 0,
    author_id: 'demo-user-001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_PROFILE,
  DEMO_NOTIFICATIONS,
  DEMO_CHAT_SESSIONS,
  BOT_REPLIES,
  DEMO_USAGE,
  DEMO_BALANCE,
  DEMO_CHAT_STATS,
  DEMO_ANALYTICS_DASHBOARD,
  DEMO_POSTS,
};
