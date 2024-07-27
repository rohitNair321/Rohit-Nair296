import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent {

  registrationForm!: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router){
    this.registrationForm = this.fb.group({
      firstName: new FormControl<string>('', [Validators.required]),
      lastName: new FormControl<string>('', [Validators.required]),
      username: new FormControl<string>('', [Validators.required]),
      emailId: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
      confirmPassword: new FormControl<string>('',[ Validators.required]),
    });
  }

  ngOnInit(){
  }

  // Additional method is added for handling the match of password and confirmPassword.
  passwordMismatch: boolean = false;
  checkPasswordMismatch(){
    const password = this.registrationForm.get('password')?.value;
    const confirmPassword = this.registrationForm.get('confirmPassword')?.value;
    this.passwordMismatch = password !== confirmPassword;
  }

  onSubmit(){
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  cancelRegistration(){
    this.router.navigateByUrl('/auth/login');
  }
}
