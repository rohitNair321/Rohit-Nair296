import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService, RegisterDTO } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  registrationForm!: FormGroup;
  loading: boolean = false;
  userRegister: RegisterDTO = new RegisterDTO()

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService){
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
    this.userRegisterAPI(this.registrationForm.value);
  }

  userRegisterAPI(userDetails: any){
    this.userRegister.firstName = this.registrationForm.value.firstName;
    this.userRegister.lastName = this.registrationForm.value.lastName;
    this.userRegister.username = this.registrationForm.value.username;
    this.userRegister.email = this.registrationForm.value.emailId;
    this.userRegister.password = this.registrationForm.value.password;
    this.auth.register(this.userRegister).pipe().subscribe({
      next: result => {
        if(result.success){
          Swal.fire({
            icon: "success",
            title: 'Registration success',
            text: result.message,
          }).then((result)=>{
            if(result.isConfirmed){
              this.router.navigate(['']);
            }
          });
        }
      },
      error: (e)=>{
      },
      complete: () =>{
        this.loading = false;
      }
    })
  }

  cancelRegistration(){
    this.router.navigateByUrl('/auth/login');
  }
  
}

