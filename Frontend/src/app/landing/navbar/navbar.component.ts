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
      }
    ]
  }

  logout(){
    this.auth.logout(sessionStorage.getItem('accessToken'));
  }

  showProfilePopup: boolean = false;
  viewProfile(){
    // this.profilePopup.showPopup();
    this.showProfilePopup = !this.showProfilePopup 
  }

  navigateTo(menuName: string){

  }
  
}
