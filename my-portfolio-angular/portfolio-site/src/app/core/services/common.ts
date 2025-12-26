import { Injector } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { OpenAIService } from "./open-ai.service";
import { SupabaseService } from "./supabase.service";
import { LoadingService } from "./loading.service";
import { defaultConfig, LayoutConfig } from "../config/layout.config";
import { AppService } from "./app.service";
import { ThemeService } from "../theme/theme.service";

export class CommonApp {

    public loading;
    public services;
    public aiServices;
    public appService;
    public portfolioServices;
    public themeService;
    public appConfig: LayoutConfig = defaultConfig;

    constructor(public injector: Injector) {
        this.loading = this.injector.get(LoadingService);
        this.services = this.injector.get(AuthService);
        this.appService = this.injector.get(AppService);
        this.aiServices = this.injector.get(OpenAIService);
        this.portfolioServices = this.injector.get(SupabaseService);
        this.themeService = this.injector.get(ThemeService);
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

    // Find the element by the ID provided (stripping the '#' if present)
    const element = document.querySelector(target);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else {
      // Fallback: If #home doesn't exist, scroll to the absolute top of the page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
