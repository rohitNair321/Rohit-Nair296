import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  items!: MenuItem[];
  loginUserName: any|undefined;
  constructor(private auth: AuthService, private router: Router){}

  ngOnInit(){
    this.loginUserName = sessionStorage.getItem('loginUserName');
    this.items = [
      {
        label:'Home',
        icon:'pi pi-home',
      },
      {
        label:'Todo',
        icon:'pi pi-list',
      },
      {
        label:'Projects',
        icon:'pi pi-server',
      },
      {
        label:'Notification',
        icon:'pi pi-bell',
      }
    ]
  }

  logout(){
    // this.auth.logout(sessionStorage.getItem('accessToken'));
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

  showProfilePopup: boolean = false;
  viewProfile(){
    // this.profilePopup.showPopup();
    this.showProfilePopup = !this.showProfilePopup 
  }

  navigateTo(menuName: string){

  }
  
}
