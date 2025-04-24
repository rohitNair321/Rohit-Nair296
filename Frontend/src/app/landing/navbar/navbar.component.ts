import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  items!: MenuItem[];
  loginUserName: any | undefined;
  isDarkTheme: boolean = false; // Default to light theme
  showProfilePopup: boolean = false;

  constructor(private auth: AuthService, private router: Router, private renderer: Renderer2) {}

  ngOnInit() {
    this.loginUserName = sessionStorage.getItem('loginUserName');
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/landing/dashboard'
      },
      {
        label: 'Todo',
        icon: 'pi pi-list',
        routerLink: '/landing/task-list'
      },
      {
        label: 'Projects',
        icon: 'pi pi-server',
        routerLink: '/landing/projects'
      },
      {
        label: 'Notification',
        icon: 'pi pi-bell',
        routerLink: '/landing/notifications'
      }
    ];

    // Apply the saved theme on initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  applyTheme() {
    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
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

  viewProfile() {
    this.showProfilePopup = !this.showProfilePopup;
  }

  navigateTo(menuName: string) {
    // Navigation logic
  }
}
