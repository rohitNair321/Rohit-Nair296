import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends CommonApp {
  private readonly fb = inject(FormBuilder);

  isloading: boolean = false;
  error: string | null = null;

  constructor(public override injector: Injector) {
    super(injector);
  }

  ngOnInit() {

  }

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true],
  });

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit(): void {
    if (this.form.invalid || this.isloading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.show('Authenticating...');
    this.error = null;

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.loading.hide();
        this.appService.setRole('ADMIN');
        this.router.navigate(['/app/home']);
      },
      error: (err) => {
        this.loading.hide();
        this.error = 'Invalid Admin Credentials';
      },
    });
  }

  onLoginWithGoogle(): void {
    this.isloading = true;
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.isloading = false;
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.isloading = false;
        this.error = err?.message ?? 'Google login failed.';
      },
    });
  }

  onLoginWithFacebook(): void {
    this.isloading = true;
    this.authService.loginWithFacebook().subscribe({
      next: () => {
        this.isloading = false;
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.isloading = false;
        this.error = err?.message ?? 'Facebook login failed.';
      },
    });
  }

  onContinueAsGuest(): void {
    // 1. Set the role signal to GUEST in memory
    this.appService.role.set('GUEST');

    // 2. Clear tokens from both signal and storage to ensure no Admin overlap
    this.appService.token.set(null);
    this.localStorageService.removeItem('auth_token');
    // Do NOT store 'GUEST' in localStorage as per your security requirement

    // 3. Navigate
    this.router.navigate(['/app/home']);
  }
}
