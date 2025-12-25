import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';

  private _currentTheme = signal<string>(this.loadInitialTheme());

  currentTheme = this._currentTheme.asReadonly();

  constructor() {
    // Ensure theme is applied on app start
    this.applyTheme(this._currentTheme());
  }

  private loadInitialTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'basic';
  }

  setTheme(theme: string) {
    this.applyTheme(theme);
    this._currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

   getTheme(): string {
    return this._currentTheme();
  }

  toggleDarkMode() {
    const current = this._currentTheme();

    if (current.endsWith('-dark')) {
      this.setTheme(current.replace('-dark', ''));
    } else {
      this.setTheme(`${current}-dark`);
    }
  }

  isDarkTheme(): boolean {
    return this._currentTheme().endsWith('-dark');
  }

  private applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
  }

}
