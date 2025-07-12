import { Injector } from "@angular/core";
import { AppService } from "src/app/auth/services/app.service";

export class CommonApp {

    public services: AppService;

    constructor(public injector: Injector) {
        this.services = this.injector.get(AppService);
    }

}
