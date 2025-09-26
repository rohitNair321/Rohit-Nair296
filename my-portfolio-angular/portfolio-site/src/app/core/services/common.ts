import { Injector } from "@angular/core";
import { AppService } from "src/app/auth/services/app.service";
import { OpenAIService } from "./open-ai.service";

export class CommonApp {

    public services: AppService;
    public aiServices: OpenAIService;

    constructor(public injector: Injector) {
        this.services = this.injector.get(AppService);
        this.aiServices = this.injector.get(OpenAIService);
    }

}
