import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent extends CommonApp {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  successMessage: string | null = null;
  error: string | null = null;
  token: string | null = null;

  constructor(public override injector: Injector) {
    super(injector);
  }

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordsMatchValidator });

  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  passwordsMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.token) {
      this.error = 'Invalid or missing reset token.';
      return;
    }

    this.error = null;
    this.successMessage = null;

    // Call your API to reset password
    this.authService.resetPassword(this.token, this.password?.value).subscribe({
      next: () => {
        this.successMessage = 'Your password has been reset successfully. You can now log in.';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err?.message ?? 'Unable to reset password. Please try again.';
      },
    });
  }
}