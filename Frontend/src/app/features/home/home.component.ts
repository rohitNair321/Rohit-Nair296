import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { CommonApp } from 'src/app/core/services/common';

interface Feature {
  icon: string;
  title: string;
  desc: string;
  badge?: string;
}

interface DemoPage {
  icon: string;
  title: string;
  desc: string;
  route: string;
  badge?: string;
  requiresAuth?: boolean;
}

interface TechBadge {
  name: string;
  color: string;
}

interface Step {
  step: number;
  title: string;
  desc: string;
  code?: string;
  lang?: string;
}

interface TokenPreview {
  name: string;
  var: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends CommonApp implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // ── Feature cards ─────────────────────────────────────────────
  readonly features: Feature[] = [
    {
      icon: 'palette',
      title: 'Token-Driven Theming',
      desc: 'Every colour is a CSS custom property. Switch themes at runtime from code or the settings panel with zero page reloads.',
      badge: 'Core',
    },
    {
      icon: 'bolt',
      title: 'Angular 19 Signals',
      desc: 'Fully signal-based reactive state across services. No Zone.js overhead, faster change detection, cleaner component logic.',
      badge: 'Performance',
    },
    {
      icon: 'view_sidebar',
      title: 'Adaptive Layout Shell',
      desc: 'CSS Grid shell with sidebar and topbar modes. Collapses to off-canvas overlay on mobile. Supports left sidebar and navbar.',
      badge: 'Layout',
    },
    {
      icon: 'smart_toy',
      title: 'AI Chat Widget',
      desc: 'Floating chat assistant with session history, markdown rendering, and localStorage persistence. Drop in your own LLM endpoint.',
      badge: 'AI',
    },
    {
      icon: 'bar_chart',
      title: 'Highcharts Integration',
      desc: 'Token-aware charts that automatically read CSS variables. Theme updates propagate to all charts without re-rendering.',
    },
    {
      icon: 'table_chart',
      title: 'PrimeNG Components',
      desc: 'Sortable tables, dialogs, calendars, radio buttons, and more — all styled to match the active theme tokens via Aura preset.',
    },
    {
      icon: 'admin_panel_settings',
      title: 'Admin CMS Shell',
      desc: 'Profile editor, experience tracker, theme builder, password management, and analytics — fully wired with reactive forms.',
      badge: 'Admin',
    },
    {
      icon: 'notifications',
      title: 'Notification Inbox',
      desc: 'Accordion-based message inbox with read, unread, and delete actions. Ready to connect to any contact or event backend.',
    },
    {
      icon: 'cloud_sync',
      title: 'API-Ready Architecture',
      desc: 'All services are wired for mock data today. Swap in real endpoints by updating service methods — no component changes needed.',
    },
  ];

  // ── Demo pages ────────────────────────────────────────────────
  readonly demoPages: DemoPage[] = [
    {
      icon: 'home',
      title: 'Landing Page',
      desc: 'This page — a fully themed, responsive startup landing page with feature grid, tech stack, theme switcher, and getting started guide.',
      route: '/',
      badge: 'Public',
    },
    {
      icon: 'settings',
      title: 'Settings & Profile',
      desc: 'Full admin profile editor with skills, experience, theme builder, avatar upload, and password management. Uses reactive forms.',
      route: '/admin/settings',
      badge: 'Admin',
      requiresAuth: true,
    },
    {
      icon: 'notifications',
      title: 'Notification Inbox',
      desc: 'Message inbox with accordion layout, unread badges, mark-as-read, and delete. Pre-loaded with sample contact form submissions.',
      route: '/admin/notifications',
      badge: 'Admin',
      requiresAuth: true,
    },
    {
      icon: 'login',
      title: 'Auth Pages',
      desc: 'Login, Register, Forgot Password, and Reset Password — all as clean form demos. Use admin@demo.com / admin123 to sign in.',
      route: '/auth/login',
      badge: 'Auth',
    },
  ];

  // ── Tech stack badges ─────────────────────────────────────────
  readonly techStack: TechBadge[] = [
    { name: 'Angular 19',    color: 'var(--error)' },
    { name: 'TypeScript',    color: '#3178C6' },
    { name: 'PrimeNG 19',    color: '#10B981' },
    { name: 'Highcharts',    color: '#1F3864' },
    { name: 'SCSS',          color: '#CF649A' },
    { name: 'RxJS 7',        color: '#E2006A' },
    { name: 'CSS Variables', color: 'var(--primary)' },
    { name: 'SSR / Express', color: '#68A063' },
    { name: 'Bootstrap 5',   color: '#7952B3' },
  ];

  // ── Token preview strip ───────────────────────────────────────
  readonly tokenPreview: TokenPreview[] = [
    { name: 'Background',   var: '--background'   },
    { name: 'Surface',      var: '--surface'      },
    { name: 'Primary',      var: '--primary'      },
    { name: 'Accent',       var: '--accent'       },
    { name: 'Success',      var: '--success'      },
    { name: 'Warning',      var: '--warning'      },
    { name: 'Error',        var: '--error'        },
    { name: 'Border',       var: '--border'       },
    { name: 'Text Primary', var: '--text-primary' },
    { name: 'Text Muted',   var: '--text-muted'   },
  ];

  // ── Getting started steps ─────────────────────────────────────
  readonly gettingStarted: Step[] = [
    {
      step: 1,
      title: 'Clone & install',
      desc: 'Clone the repository and install dependencies.',
      code: `git clone https://github.com/your-org/angular-boilerplate.git
cd angular-boilerplate
npm install
npm run dev`,
      lang: 'bash',
    },
    {
      step: 2,
      title: 'Wire in your API endpoints',
      desc: 'All services are pre-built for mock data. Replace the mock methods with real HTTP calls.',
      code: `// src/app/core/services/app.service.ts
// Replace this:
getProfile(): Observable<Profile | null> {
  return of(MOCK_PROFILE).pipe(delay(300));
}

// With this:
getProfile(): Observable<Profile | null> {
  return this.http.get<{ profile: Profile }>('/api/profile')
    .pipe(map(r => r.profile), tap(p => this._profile.set(p)));
}`,
      lang: 'typescript',
    },
    {
      step: 3,
      title: 'Register your themes',
      desc: 'Add custom themes via the settings panel UI, or load them from your API at startup.',
      code: `// From any component or service:
this.themeService.registerThemes([{
  id: 'ocean',
  name: 'Ocean Blue',
  tokens: {
    primary: '#0EA5E9',
    accent: '#6366F1',
    background: '#F0F9FF',
    surface: '#FFFFFF',
    // ... all token keys
  },
  darkTokens: { /* dark variants */ }
}]);`,
      lang: 'typescript',
    },
    {
      step: 4,
      title: 'Configure your layout',
      desc: 'Toggle between sidebar and navbar modes, adjust brand position, and set the default theme.',
      code: `// src/app/layouts/main-layout/main-layout.component.ts
this.appConfig.appConfiguration.type = 'sidebar'; // or 'navbar'
this.appConfig.appConfiguration.collapsed = true;
this.appConfig.appConfiguration.showAgentChat = true;`,
      lang: 'typescript',
    },
  ];

  constructor(public override injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTheme(id: string): void {
    this.themeService.setTheme(id);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
