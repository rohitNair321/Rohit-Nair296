import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router:Router, private auth: AuthService){
    
  }

  ngOnInit(){

  }

  login(): void{
    if(this.auth.login(this.username, this.password)){
      location.href = '/task-list';
    }else{
      this.errorMessage = "Invalid username or password";
    }
  }

}
