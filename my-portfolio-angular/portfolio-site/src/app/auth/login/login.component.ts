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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isloading:boolean = false;
  error: string | null = null;

  constructor(public override injector: Injector) {
    super(injector);
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
        // Redirect after login. For now send to home or dashboard.
        this.router.navigateByUrl('/app');
      },
      error: (err) => {
        this.loading.hide();
        this.error = err?.message ?? 'Unable to login. Please try again.';
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
}
