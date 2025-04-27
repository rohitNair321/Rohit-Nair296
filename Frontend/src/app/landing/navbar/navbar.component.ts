import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isBurgerMenuOpen: boolean = false;
  isDarkTheme: boolean = false;
  showProfilePopup: boolean = false;
  loginUserName: string = 'John Doe'; // Example user name

  items = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/landing/dashboard' },
    { label: 'To-Do', icon: 'pi pi-list', routerLink: '/landing/task-list' },
    { label: 'Projects', icon: 'pi pi-server', routerLink: '/landing/projects' },
    { label: 'Notifications', icon: 'pi pi-bell', routerLink: '/landing/notifications' }
  ];

  profileMenuItems = [
    { label: 'User Profile', icon: 'pi pi-user', action: () => this.navigateTo('profile') },
    { label: 'Account Settings', icon: 'pi pi-cog', action: () => this.navigateTo('account-settings') },
    { label: 'Preferences', icon: 'pi pi-globe', action: () => this.navigateTo('preferences') },
    { label: 'Recent Activity', icon: 'pi pi-clock', action: () => this.navigateTo('recent-activity') },
    { label: 'Help & Support', icon: 'pi pi-question-circle', action: () => this.navigateTo('help-support') },
    { label: 'Logout', icon: 'pi pi-power-off', action: () => this.logout() }
  ];
  
  constructor(private router: Router, private auth: AuthService,) {} // Inject Router

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
  }

  toggleBurgerMenu() {
    this.isBurgerMenuOpen = !this.isBurgerMenuOpen;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    document.body.classList.toggle('light-theme', !this.isDarkTheme);
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  toggleProfileMenu() {
    this.showProfilePopup = !this.showProfilePopup;
  }

  navigateTo(route: string) {
    this.router.navigate(['/profile-menu/'+route]); // Navigate to the specified route
  }

  logout() {
    this.auth.logout(sessionStorage.getItem('accessToken')).subscribe({
      next: () => {
        this.router.navigate(['']);
        console.log('Logged out successfully');
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }
}
