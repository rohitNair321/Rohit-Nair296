import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { CommonApp } from 'src/app/core/services/common';

interface Feature {
  icon:  string;
  title: string;
  desc:  string;
}

interface TechBadge {
  name:  string;
  color: string;   // used as CSS custom property value for the dot
}

interface Step {
  step:  number;
  title: string;
  desc:  string;
  code?: string;
  lang?: string;
}

interface TokenPreview {
  name: string;
  var:  string;   // CSS variable e.g. '--primary'
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends CommonApp implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // ── Feature cards ─────────────────────────────────────────────
  readonly features: Feature[] = [
    {
      icon:  'palette',
      title: 'Token-Driven Theming',
      desc:  'Every colour is a CSS custom property. Switch themes at runtime — from code or the API — with zero page reloads.',
    },
    {
      icon:  'bolt',
      title: 'Angular 19 Signals',
      desc:  'Fully signal-based reactive state: no Zone.js overhead, faster change detection, and cleaner component logic.',
    },
    {
      icon:  'view_sidebar',
      title: 'Adaptive Layout',
      desc:  'CSS Grid shell with sidebar + topbar. Collapses to off-canvas on mobile. Supports left/right sidebar and navbar modes.',
    },
    {
      icon:  'bar_chart',
      title: 'Highcharts Integration',
      desc:  'Token-aware Highcharts charts that automatically read CSS variables — themes update all charts without re-render.',
    },
    {
      icon:  'table_chart',
      title: 'PrimeNG Components',
      desc:  'Sortable, paginated p-table, date pickers, tooltips, and more — all styled to match the active theme tokens.',
    },
    {
      icon:  'cloud_sync',
      title: 'API-Ready Architecture',
      desc:  'ThemeService accepts raw API token payloads and applies them to :root instantly. Drop your backend in and go.',
    },
  ];

  // ── Tech stack badges ─────────────────────────────────────────
  readonly techStack: TechBadge[] = [
    { name: 'Angular 19',     color: 'var(--error)' },
    { name: 'TypeScript',     color: '#3178C6' },
    { name: 'Highcharts',     color: '#1F3864' },
    { name: 'PrimeNG',        color: '#10B981' },
    { name: 'SCSS',           color: '#CF649A' },
    { name: 'RxJS',           color: '#E2006A' },
    { name: 'Supabase',       color: '#3ECF8E' },
    { name: 'Node.js',        color: '#68A063' },
    { name: 'CSS Variables',  color: 'var(--primary)' },
  ];

  // ── Token preview strip ───────────────────────────────────────
  readonly tokenPreview: TokenPreview[] = [
    { name: 'Background',    var: '--background'    },
    { name: 'Surface',       var: '--surface'       },
    { name: 'Primary',       var: '--primary'       },
    { name: 'Accent',        var: '--accent'        },
    { name: 'Success',       var: '--success'       },
    { name: 'Warning',       var: '--warning'       },
    { name: 'Error',         var: '--error'         },
    { name: 'Border',        var: '--border'        },
    { name: 'Text Primary',  var: '--text-primary'  },
    { name: 'Text Muted',    var: '--text-muted'    },
  ];

  // ── Getting started steps ─────────────────────────────────────
  readonly gettingStarted: Step[] = [
    {
      step:  1,
      title: 'Clone & install',
      desc:  'Clone the repository and install dependencies.',
      code:  `git clone https://github.com/your-org/rohit-angular-boilerplate.git
cd rohit-angular-boilerplate
npm install`,
      lang: 'bash',
    },
    {
      step:  2,
      title: 'Register your themes',
      desc:  'Inject ThemeService and register themes from your API or use the built-in tokens.',
      code:  `// app.component.ts
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.api.getThemes().subscribe(themes => {
      // Accepts raw API payload — applies tokens to :root
      this.themeService.setThemeFromAPI(themes);
    });
  }
}`,
      lang: 'typescript',
    },
    {
      step:  3,
      title: 'Use tokens in your SCSS',
      desc:  'Reference CSS custom properties anywhere — they update automatically when the theme changes.',
      code:  `.my-card {
  background: var(--surface);
  border:     1px solid var(--border);
  color:      var(--text-primary);

  &:hover {
    box-shadow: 0 4px 16px var(--primary-glow);
  }

  .title { color: var(--primary); }
}`,
      lang: 'scss',
    },
    {
      step:  4,
      title: 'Apply a theme from anywhere',
      desc:  'Call setTheme() with any registered ID to switch the active theme and persist the choice.',
      code:  `// From any component
this.themeService.setTheme('modern-blue');

// Or toggle dark mode
this.themeService.toggleDarkMode();

// Read current state
const isDark = this.themeService.isDark();       // Signal<boolean>
const themeId = this.themeService.currentThemeId(); // Signal<string>`,
      lang: 'typescript',
    },
  ];

  // ──────────────────────────────────────────────────────────────

  constructor(public override injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    // Seed theme from profile API if available
    // (profile is loaded by the parent layout; themes registered there)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Theme selection ───────────────────────────────────────────
  selectTheme(id: string): void {
    this.themeService.setTheme(id);
  }
}