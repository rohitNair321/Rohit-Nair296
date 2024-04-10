import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { ProfilePopupService } from 'src/app/Services/profile-popup.service';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  items!: MenuItem[];
  constructor(private auth: AuthService, private router: Router, private profilePopup: ProfilePopupService){}

  ngOnInit(){
    this.items = [
      {
          label:'Home',
          icon:'pi pi-home',
      }
    ]
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['']);
  }

  showProfilePopup: boolean = false;
  viewProfile(){
    // this.profilePopup.showPopup();
    this.showProfilePopup = !this.showProfilePopup 
  }

  navigateTo(menuName: string){

  }
  
}
