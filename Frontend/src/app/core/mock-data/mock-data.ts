import { Notification, Profile } from '../services/app.service';
import { BalanceResponse, ChatSessionDto, UsageResponse } from '../services/chat-api.service';

// ── Demo admin credentials ────────────────────────────────────────────────────
export const DEMO_ADMIN_EMAIL    = 'admin@demo.com';
export const DEMO_ADMIN_PASSWORD = 'admin123';

// ── Mock profile ──────────────────────────────────────────────────────────────
export const MOCK_PROFILE: Profile = {
  id: 'demo-user-001',
  full_name: 'Alex Johnson',
  description: 'Full-stack developer passionate about clean architecture, great UX, and developer tooling.',
  email: 'alex@demo.com',
  primary_phone: '+1 (555) 123-4567',
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
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-11-01T14:30:00Z',
};

// ── Mock notifications ────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification = {
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
      message: "Excellent work on the SSR setup and PrimeNG integration. We are evaluating this for our client's enterprise portal. Can we schedule a quick call?",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'notif-003',
      first_name: 'Priya',
      last_name: 'Sharma',
      email: 'priya.sharma@techlab.in',
      message: "Love the signal-based architecture! Just forked the repo. One question — how do I add a new custom theme without touching the theme service?",
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
      message: "We are using this boilerplate as the foundation for a large-scale Angular app. The theme engine and the admin layout are both excellent. Any plans to add Tailwind support?",
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ],
};

// ── Mock AI chat bot responses ────────────────────────────────────────────────
export const BOT_RESPONSES: string[] = [
  "This boilerplate uses a **token-driven theming system** where every colour is a CSS custom property. You can switch themes at runtime without any page reload by calling `themeService.setTheme(id)`.",
  "The layout shell supports two modes: **sidebar** and **navbar**. You can toggle between them in the settings panel (the gear icon on the right edge). It automatically collapses to off-canvas on mobile.",
  "Angular 19 **Signals** are used for all reactive state in this project. They replace Zone.js-driven change detection, giving you faster rendering and more predictable data flow.",
  "To add a new theme, call `themeService.registerThemes([...])` with an array of `ThemeDefinition` objects. Each theme needs `id`, `name`, `tokens` (light), and optionally `darkTokens`.",
  "The **PrimeNG** integration uses the Aura preset. Every PrimeNG component inherits from the active theme tokens, so switching themes updates the whole UI — including tables, dialogs, and date pickers.",
  "Highcharts charts in this boilerplate read from CSS custom properties automatically. That means your charts update their colour scheme whenever the active theme changes.",
  "The **settings page** is a full demo of a profile editor, theme builder, experience tracker, and password manager — all wired up with reactive forms and the signal state.",
  "Authentication in the demo uses `admin@demo.com` / `admin123` to log in as admin. Any other credentials log you in as a guest. No real backend is needed.",
  "The chat widget persists sessions in **localStorage**. You can start multiple conversations, switch between them from the history panel, or delete sessions individually.",
  "This boilerplate is MIT-licensed and designed to be forked. Delete the pages you do not need, wire in your own API endpoints, and you have a production-ready Angular app in minutes.",
];

// ── Mock AI usage data ────────────────────────────────────────────────────────
export const MOCK_USAGE_RESPONSE: UsageResponse = {
  summary: {
    totalTokens: 284_500,
    inputTokens: 198_200,
    outputTokens: 86_300,
    totalCost: 4.27,
  },
  trend: Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toISOString().slice(0, 10),
      tokens: Math.floor(Math.random() * 25_000) + 5_000,
      inputTokens: Math.floor(Math.random() * 18_000) + 3_000,
      outputTokens: Math.floor(Math.random() * 8_000) + 1_000,
      cost: parseFloat((Math.random() * 0.5).toFixed(4)),
      requests: Math.floor(Math.random() * 80) + 10,
    };
  }),
  byModel: [
    { model: 'AiNg v2.5 Stable', totalTokens: 142_000, inputTokens: 99_000, outputTokens: 43_000, cost: 2.13, requests: 312 },
    { model: 'AiNg v1.5 Stable', totalTokens: 98_500,  inputTokens: 68_900, outputTokens: 29_600, cost: 1.48, requests: 228 },
    { model: 'AiNg v1.5 Beta',   totalTokens: 44_000,  inputTokens: 30_300, outputTokens: 13_700, cost: 0.66, requests: 104 },
  ],
  byRole: {
    admin: { totalTokens: 185_000, inputTokens: 129_500, outputTokens: 55_500, cost: 2.78, requests: 430 },
    guest: { totalTokens: 99_500,  inputTokens: 68_700,  outputTokens: 30_800, cost: 1.49, requests: 214 },
  },
  sessions: Array.from({ length: 8 }, (_, i) => ({
    sessionId: `sess-${String(i + 1).padStart(3, '0')}`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    totalTokens: Math.floor(Math.random() * 40_000) + 5_000,
    inputTokens: Math.floor(Math.random() * 28_000) + 3_500,
    outputTokens: Math.floor(Math.random() * 12_000) + 1_500,
    cost: parseFloat((Math.random() * 0.6).toFixed(4)),
    requests: Math.floor(Math.random() * 60) + 5,
    model: ['AiNg v2.5 Stable', 'AiNg v1.5 Stable', 'AiNg v1.5 Beta'][i % 3],
  })),
  allTime: {
    totalTokens: 284_500,
    inputTokens: 198_200,
    outputTokens: 86_300,
    totalRequests: 644,
    totalCost: 4.27,
  },
};

// ── Mock balance ──────────────────────────────────────────────────────────────
export const MOCK_BALANCE: BalanceResponse = {
  source: 'openai',
  totalUsedUSD: 4.27,
  hardLimitUSD: 20.00,
  remainingUSD: 15.73,
  remainingPct: 78.65,
};

// ── Seed chat sessions ────────────────────────────────────────────────────────
export const SEED_CHAT_SESSIONS: ChatSessionDto[] = [
  {
    id: 'seed-session-001',
    title: 'How does the theming system work?',
    model: 'v2.5s',
    messages: [
      { sender: 'user', text: 'How does the theming system work?', time: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
      { sender: 'bot',  text: "This boilerplate uses a **token-driven theming system** where every colour is a CSS custom property. You can switch themes at runtime without any page reload by calling `themeService.setTheme(id)`.", time: new Date(Date.now() - 1000 * 60 * 9).toISOString() },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
  },
  {
    id: 'seed-session-002',
    title: 'How do I add a new route?',
    model: 'v1.5s',
    messages: [
      { sender: 'user', text: 'How do I add a new route to the app?', time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { sender: 'bot',  text: "Open `src/app/app.routes.ts` and add a new entry to the `routes` array. Use `loadComponent` for lazy loading. If the route should be admin-only, nest it under the `/admin` path which has the `tokenGuard` applied.", time: new Date(Date.now() - 1000 * 60 * 60 * 2 + 30_000).toISOString() },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2 + 30_000).toISOString(),
  },
];
