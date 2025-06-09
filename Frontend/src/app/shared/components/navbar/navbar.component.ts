import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavigationComponent implements OnInit {
  isBurgerMenuOpen: boolean = false;
  isDarkTheme: boolean = false;
  showProfilePopup: boolean = false;
  loginUserName!: string; // Example user name
  isSidebarOpen = false;
  profileImageUrl: string | null = null;

  items = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/features/dashboard' },
    { label: 'To-Do', icon: 'pi pi-list', routerLink: '/features/task-list' },
    { label: 'Projects', icon: 'pi pi-server', routerLink: '/features/projects' },
    { label: 'Notifications', icon: 'pi pi-bell', routerLink: '/features/notifications' }
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
    this.loginUserName = sessionStorage.getItem('loginUserName') || 'User'; // Get the user name from session storage
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

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(route: string) {
    this.router.navigate(['/profile-menu/'+route]);
    this.showProfilePopup = false; // Navigate to the specified route
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  onProfilePicChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
        // Optionally, save to localStorage/sessionStorage or upload to server
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
