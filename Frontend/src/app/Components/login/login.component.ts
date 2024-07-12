import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loginForm!: FormGroup;

  constructor(private router:Router, private auth: AuthService, private fb: FormBuilder,private messageService: MessageService){
    
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
          this.router.navigateByUrl('task-list');
        }
      }),
      error: (e) =>{
        this.loading = false;
        this.messageService.add({key: 'tc', severity:'error', summary: 'Invalid authentication', detail: 'Invalid loginId or Password', life: 4000})
      }
    });
  }

}
