import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/components/ui/alert-dialog/alert.component';
import { SpinnerComponent } from './shared/components/ui/spinner-overlay/spinner.component';
import { AnalyticsService } from './core/services/analytics.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SpinnerComponent, AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(private router: Router, private analytics: AnalyticsService) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.analytics.trackEvent('page_view', {
        page_path: event.urlAfterRedirects
      });
    });
  }

  ngOnInit() {

  }
}
