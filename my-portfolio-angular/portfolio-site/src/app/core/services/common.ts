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
    public appServices;
    public portfolioServices;
    public themeService;
    public appConfig: LayoutConfig = defaultConfig;

    constructor(public injector: Injector) {
        this.loading = this.injector.get(LoadingService);
        this.services = this.injector.get(AuthService);
        this.appServices = this.injector.get(AppService);
        this.aiServices = this.injector.get(OpenAIService);
        this.portfolioServices = this.injector.get(SupabaseService);
        this.themeService = this.injector.get(ThemeService);
    }

    // public initializeTheme() {
    //     document.body.classList.toggle('dark-mode', this.isDarkTheme);
    //     return this.isDarkTheme = this.appConfig.appConfiguration.theme == 'dark' ? true : false;
    // }

    public themeToggle() {
        this.themeService.toggleDarkMode();
    }
}
