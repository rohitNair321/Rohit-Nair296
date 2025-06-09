import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LayoutConfig, defaultConfig } from 'src/app/core/config/layout.config';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private configSubject = new BehaviorSubject<LayoutConfig>(defaultConfig);
  config$ = this.configSubject.asObservable();

  constructor() {
    this.loadTheme();
    this.applyTheme(this.configSubject.value);
  }

  private loadTheme() {
    const savedConfig = localStorage.getItem('portfolioConfig');
    if (savedConfig) {
      this.configSubject.next(JSON.parse(savedConfig));
    }
  }

  updateConfig(config: Partial<LayoutConfig>) {
    const currentConfig = this.configSubject.value;
    const newConfig = { ...currentConfig, ...config };
    this.configSubject.next(newConfig);
    localStorage.setItem('portfolioConfig', JSON.stringify(newConfig));
    this.applyTheme(newConfig);
  }

  private applyTheme(config: LayoutConfig) {
    document.documentElement.style.setProperty('--primary-color', config.theme.primary);
    document.documentElement.style.setProperty('--secondary-color', config.theme.secondary);
    document.documentElement.style.setProperty('--background-color', config.theme.background);
    document.documentElement.style.setProperty('--text-color', config.theme.text);
    document.documentElement.style.setProperty('--font-family', config.typography.fontFamily);
    document.documentElement.style.setProperty('--heading-font', config.typography.headingFont);
    document.documentElement.style.setProperty('--body-font', config.typography.bodyFont);
  }

  toggleDarkMode() {
    const currentConfig = this.configSubject.value;
    const darkMode = !currentConfig.theme.darkMode;
    this.updateConfig({
      theme: {
        ...currentConfig.theme,
        darkMode,
        background: darkMode ? '#1f2937' : '#ffffff',
        text: darkMode ? '#ffffff' : '#1f2937',
      },
    });
  }
}
