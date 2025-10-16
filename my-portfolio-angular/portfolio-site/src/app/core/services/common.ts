import { Injector } from "@angular/core";
import { AppService } from "src/app/auth/services/app.service";
import { OpenAIService } from "./open-ai.service";
import { SupabaseService } from "./supabase.service";
import { LoadingService } from "./loading.service";

export class CommonApp {

    public loading;
    public services;
    public aiServices;
    public portfolioServices;

    constructor(public injector: Injector) {
        this.loading = this.injector.get(LoadingService);
        this.services = this.injector.get(AppService);
        this.aiServices = this.injector.get(OpenAIService);
        this.portfolioServices = this.injector.get(SupabaseService);
    }

}
