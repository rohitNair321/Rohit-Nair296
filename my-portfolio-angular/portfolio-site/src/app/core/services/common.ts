import { Injector } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { OpenAIService } from "./open-ai.service";
import { SupabaseService } from "./supabase.service";
import { LoadingService } from "./loading.service";
import { defaultConfig, LayoutConfig } from "../config/layout.config";
import { AppService } from "./app.service";
import { ThemeService } from "../theme/theme.service";
import { AlertService } from "./alert.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { MenuItem } from "../config/menuItem.config";

export class CommonApp {

  public loading;
  public authService;
  public aiServices;
  public appService;
  public portfolioServices;
  public themeService;
  public alertService;
  public router;
  public localStorageService;
  public appConfig: LayoutConfig = defaultConfig;
  public menuItems: MenuItem[] = [
    new MenuItem({ label: 'Home', href: '#home', icon: 'home' }),
    new MenuItem({ label: 'About Me', href: '#about', icon: 'person' }),
    new MenuItem({ label: 'Projects', href: '#projects', icon: 'work' }),
    // new MenuItem({
    //   label: 'Admin',
    //   icon: 'dashboard_customize',
    //   expanded: false,
    //   subMenu: [
    //     new MenuItem({ label: 'Dashboard', routerLink: '/admin/dashboard', icon: 'dashboard' }),
    //     new MenuItem({ label: 'Settings', routerLink: '/admin/settings', icon: 'settings' })
    //   ]
    // }),
    new MenuItem({ label: 'Contact', href: '#contact', icon: 'mail' }),
  ];

  constructor(public injector: Injector) {
    this.loading = this.injector.get(LoadingService);
    this.authService = this.injector.get(AuthService);
    this.appService = this.injector.get(AppService);
    this.aiServices = this.injector.get(OpenAIService);
    this.alertService = this.injector.get(AlertService);
    this.portfolioServices = this.injector.get(SupabaseService);
    this.themeService = this.injector.get(ThemeService);
    this.router = this.injector.get(Router);
    this.localStorageService = this.injector.get(LocalStorageService);
  }

  public themeToggle() {
    this.themeService.toggleDarkMode();
  }

  /**
   * Scrolls the window to a specific section smoothly
   * @param event The mouse event to prevent default anchor behavior
   * @param target The ID of the element (e.g., '#home')
   */
  scrollToSection(event: Event, target: string): void {
    event.preventDefault();
    const element = document.querySelector(target);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  public normalizeThemesResponse(raw: any): any[] {
    // 1. Handle stringified input from DB
    let data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!data) return [];

    // 2. If it's an object with keys (your current "corrupted" state), convert to clean array
    if (!Array.isArray(data) && typeof data === 'object') {
      return Object.entries(data).map(([key, value]: [string, any]) => {
        // Check if the value is nested (like your "0": { "theme-warm": ... } example)
        const isNested = value && typeof value === 'object' && !value.tokens;
        const themeData = isNested ? Object.values(value)[0] : value;
        const actualId = isNested ? Object.keys(value)[0] : key;

        return {
          id: actualId,
          ...themeData
        };
      }).filter(t => t.name); // Remove empty entries
    }

    // 3. If it's already a clean array, just return it
    return Array.isArray(data) ? data : [];
  }

  applyThemeFromProfile(profile: any) {
    if (!profile) return;
    const themeList = this.normalizeThemesResponse(profile.themes);
    const currentTheme = themeList.find(theme => theme.name === profile.currenttheme);
    this.themeService.registerThemes(themeList);

    // Apply selected theme
    if (currentTheme) {
      this.themeService.setTheme(currentTheme.id);
    }
  }

  downloadResume(resumeUrl: any) {
    fetch(resumeUrl)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = 'Rohit_Resume.pdf';
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }

  // Add this utility to your CommonApp class or a helper file
  decodeHtml(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    // We call it twice because your string has multiple layers of &amp;
    let decoded = txt.value;
    while (decoded.includes('&')) {
      txt.innerHTML = decoded;
      decoded = txt.value;
    }
    return decoded;
  }
}
