// src/app/app.config.ts
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from '@angular/cdk/dialog';
import { authInterceptor } from './core/interceptors/app.interceptor';

export function initApp() {
  return () => Promise.resolve();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) // <- add if you have one
    ),
    provideAnimations(),
    importProvidersFrom(
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      CardModule,
      DialogModule
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true
    },
  ],
};
