import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeKey = 'dark-mode';

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    const isDarkMode = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem(this.darkModeKey, isDarkMode.toString());
    return isDarkMode;
  }

  loadTheme(): void {
    const isDarkMode = localStorage.getItem(this.darkModeKey) === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    }
  }
}
