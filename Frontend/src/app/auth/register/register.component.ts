import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';



export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.value.password;
  const confirmPassword = control.value.confirmPassword;
  // console.log(password === confirmPassword ? { passwordMismatch: true } : { passwordMismatch: false });
  return password === confirmPassword? null : { passwordMismatch: false } 
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent {

  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder){
    this.registrationForm = this.fb.group({
      firstName: new FormControl<string>('', [Validators.required]),
      lastName: new FormControl<string>('', [Validators.required]),
      username: new FormControl<string>('', [Validators.required]),
      emailId: new FormControl<string>('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
      confirmPassword: new FormControl<string>('',[ Validators.required]),
    } , { validators: passwordMatchValidator });
  }

  ngOnInit(){
  }


  onSubmit(){
    console.log(this.registrationForm.errors)
  
  }
}
