import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'basic';
  }

  toggleDarkMode() {
    const current = this.getTheme();

    if (current.endsWith('-dark')) {
      this.setTheme(current.replace('-dark', ''));
    } else {
      this.setTheme(`${current}-dark`);
    }
  }

  isDarkTheme(): boolean {
    const theme = this.getTheme();
    return theme.endsWith('-dark');
  }

}
