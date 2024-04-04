import { Component } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isTaskListPage: boolean = false;
  showProfilePopup: boolean = false;
  constructor(private router: Router) {
    // Listen for route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the task-list page
        this.isTaskListPage = event.url === '/task-list';
      }
    });
  }

}
