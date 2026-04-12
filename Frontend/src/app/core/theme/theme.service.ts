import {
  Injectable,
  signal,
  effect,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

// ── Types ─────────────────────────────────────────────────────

export interface ThemeDefinition {
  id: string;
  name: string;
  tokens: Record<string, string>;   // light mode
  dark_tokens: Record<string, string>;   // dark mode
}

/**
 * Minimal shape the API returns per theme.
 * The service accepts this and converts it into ThemeDefinition.
 */
export interface ApiThemePayload {
  id: string;
  name: string;
  tokens: Record<string, string>;
  dark_tokens: Record<string, string>;
}

// ── Built-in static themes ────────────────────────────────────
// These are registered at startup so the app renders before the
// API returns. The ThemeService also accepts API-registered
// themes via registerThemes() — they override these if the IDs
// match, otherwise they are added to the registry.

const BUILT_IN_THEMES: ThemeDefinition[] = [
  {
    id: 'boilerplate',
    name: 'Boilerplate',
    tokens: {
      background: '#F5F7FA',
      surface: '#FFFFFF',
      'surface-alt': '#EFF2F7',
      'text-primary': '#1B2333',
      'text-secondary': '#3D4F66',
      'text-muted': '#6B7A99',
      primary: '#2563EB',
      accent: '#0EA5E9',
      'primary-glow': 'rgba(37,99,235,0.15)',
      border: '#DDE3EE',
      success: '#16A34A',
      warning: '#D97706',
      error: '#DC2626',
      'logo-primary': '#2563EB',
      'logo-secondary': '#0EA5E9',
      'logo-border': '#BFDBFE',
      'logo-border-hover': '#93C5FD',
      'logo-shadow': 'rgba(37,99,235,0.18)',
    },
    dark_tokens: {
      background: '#0D1117',
      surface: '#161B27',
      'surface-alt': '#1C2333',
      'text-primary': '#E2E8F0',
      'text-secondary': '#94A3B8',
      'text-muted': '#64748B',
      primary: '#3B82F6',
      accent: '#38BDF8',
      'primary-glow': 'rgba(59,130,246,0.35)',
      border: '#1E293B',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      'logo-primary': '#3B82F6',
      'logo-secondary': '#38BDF8',
      'logo-border': 'rgba(59,130,246,0.28)',
      'logo-border-hover': 'rgba(59,130,246,0.5)',
      'logo-shadow': 'rgba(0,0,0,0.6)',
    },
  },
];

// ── Service ───────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly THEME_KEY = 'selected-theme-id';
  private readonly DARK_KEY = 'is-dark-mode';

  private platformId = inject(PLATFORM_ID);
  private localStorageService = inject(LocalStorageService);

  // ── Reactive state ────────────────────────────────────────────
  currentThemeId = signal<string>(
    this.localStorageService.getItem(this.THEME_KEY) || 'boilerplate'
  );
  isDark = signal<boolean>(
    this.localStorageService.getItem(this.DARK_KEY) === 'true'
  );

  // ── Theme registry ────────────────────────────────────────────
  private _registry = new Map<string, ThemeDefinition>();

  constructor() {
    // Seed built-in themes so the page renders before API loads
    BUILT_IN_THEMES.forEach(t => this._registry.set(t.id, t));

    // Auto re-apply whenever ID or dark mode changes
    effect(() => {
      this._applyTheme(this.currentThemeId(), this.isDark());
    });
  }

  // ── Computed ──────────────────────────────────────────────────

  activeTheme = computed(() => this._registry.get(this.currentThemeId()));

  /** All registered themes — used for theme pickers */
  availableThemes = computed(() => Array.from(this._registry.values()));

  isChristmasTheme = computed(() => {
    const t = this.activeTheme();
    if (!t) { return false; }
    const s = (t.id + t.name).toLowerCase();
    return s.includes('christmas');
  });

  isNewYearTheme = computed(() => {
    const t = this.activeTheme();
    if (!t) { return false; }
    const s = (t.id + t.name).toLowerCase();
    return ['new year', 'newyear', 'celebration'].some(k => s.includes(k));
  });

  // ── Public API ────────────────────────────────────────────────

  /** Register themes from API or local config. */
  registerThemes(themes: ThemeDefinition[]): void {
    themes.forEach(t => this._registry.set(t.id, t));
    // Re-apply in case the active theme data just arrived
    this._applyTheme(this.currentThemeId(), this.isDark());
  }

  /**
   * Accept raw API response tokens and apply them immediately.
   * If the theme has no existing registration it is auto-registered.
   *
   * Usage:
   *   this.themeService.setThemeFromAPI(apiResponse.themes);
   */
  setThemeFromAPI(themes: ApiThemePayload[]): void {
    themes.forEach(t => {
      this._registry.set(t.id, {
        id: t.id,
        name: t.name,
        tokens: t.tokens,
        dark_tokens: t.dark_tokens,
      });
    });
    // Re-apply — now that tokens are registered
    this._applyTheme(this.currentThemeId(), this.isDark());
  }

  /**
   * Apply a one-off set of raw token values without registering a
   * full ThemeDefinition. Useful for live-preview / token overrides.
   */
  applyRawTokens(tokens: Record<string, string>): void {
    if (!isPlatformBrowser(this.platformId)) { return; }
    const root = document.documentElement;
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/_/g, '-')}`, value);
    });
  }

  /** Switch the active theme. */
  setTheme(themeId: string): void {
    this.localStorageService.setItem(this.THEME_KEY, themeId);
    this.currentThemeId.set(themeId);
  }

  /** Toggle between light and dark mode. */
  toggleDarkMode(): void {
    const next = !this.isDark();
    this.localStorageService.setItem(this.DARK_KEY, String(next));
    this.isDark.set(next);
  }

  // ── Private ───────────────────────────────────────────────────

  private _applyTheme(id: string, dark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) { return; }

    const theme = this._registry.get(id);
    if (!theme) { return; }

    const tokens = dark ? theme.dark_tokens : theme.tokens;
    const root = document.documentElement;

    // Set the data-theme attribute so CSS [data-theme] selectors fire too
    root.setAttribute('data-theme', dark ? `${id}-dark` : id);

    // Apply all tokens as CSS custom properties
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/_/g, '-')}`, value);
    });
  }
}