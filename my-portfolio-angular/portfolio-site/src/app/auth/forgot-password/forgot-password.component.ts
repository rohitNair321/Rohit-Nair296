import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent extends CommonApp {
  private readonly fb = inject(FormBuilder);
  successMessage: string | null = null;
  error: string | null = null;
  sending = false;

  constructor(public override injector: Injector) {
    super(injector);
  }

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email() {
    return this.form.get('email');
  }

  onSubmit(): void {
    if (this.form.invalid || this.sending) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.value;
    this.error = null;
    this.successMessage = null;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.successMessage =
          'If this email exists in our records, password reset instructions have been sent.';
      },
      error: (err) => {
        this.error = err?.message ?? 'Unable to process request. Please try again.';
      },
    });
  }
}
