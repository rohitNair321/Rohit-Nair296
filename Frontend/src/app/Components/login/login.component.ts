import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loginForm!: FormGroup;

  constructor(private router:Router, private auth: AuthService, private fb: FormBuilder){
    
  }

  ngOnInit(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.auth.isAuthenticated$().subscribe({
      next: result =>{
        if(result){
          this.router.navigateByUrl('task-list');
        }else{
          this.errorMessage = "Invalid username or password";
        }
      }
    });
  }

  onSubmit(){
    this.login();
  }

  login(): void{
    this.auth.login(this.loginForm.value);
  }

}
