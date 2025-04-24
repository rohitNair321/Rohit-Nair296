import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
  }

  loading?: boolean;
  onSubmit(){
    this.loading = true;
    this.login();
  }

  login(): void{
    this.auth.login(this.loginForm.value).subscribe({
      next: (result =>{
        this.loading = false;
        if(result){
          this.router.navigateByUrl('landing/dashboard');
        }
      }),
      error: (e) =>{
        this.loading = false;
      }
    });
  }

  register(){
    this.router.navigateByUrl('/auth/register');
  }

}
