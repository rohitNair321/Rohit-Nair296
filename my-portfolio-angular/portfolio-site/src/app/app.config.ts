// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, provideAppInitializer } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from '@angular/cdk/dialog';
import { authInterceptor } from './core/interceptors/app.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideMarkdown } from 'ngx-markdown';


export function initApp() {
  return () => Promise.resolve();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideMarkdown(),
    providePrimeNG({ 
            theme: {
                preset: Aura
            }
        }),
    provideRouter(
      routes, 
      withHashLocation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
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
    provideAppInitializer(() => {
        const initializerFn = (initApp)();
        return initializerFn();
      }), provideClientHydration(),
  ],
};
