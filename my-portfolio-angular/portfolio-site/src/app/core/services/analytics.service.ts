import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAnalytics();
    }
  }

  private loadAnalytics(): void {
    if (!environment.gaTrackingId) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaTrackingId}`;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${environment.gaTrackingId}');
    `;
    document.head.appendChild(inlineScript);
  }

  trackEvent(eventName: string, params?: any) {
    if (isPlatformBrowser(this.platformId) && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  }
}
