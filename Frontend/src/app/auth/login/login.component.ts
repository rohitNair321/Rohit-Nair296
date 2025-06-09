import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  googleClientId: string = environment.googleClientId;
  googleLoginUri: string = environment.authApiUrl + '/google-login';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Initialize the login form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleGoogleSignIn.bind(this),
      auto_select: true,
      itp_support: true,
      cancel_on_tap_outside: true,
    });
    // @ts-ignore
    google.accounts.id.renderButton(
    // @ts-ignore
    document.getElementById("google-signin-button"),
      { theme: "outline",
        type:"standard",
        shape:"pill",
        size:"medium",
        text:"signin",
        logo_alignment:"left"
      }
    );
    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => {});
  }

  // Handle standard login
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (result) => {
          this.loading = false;
          if (result) {
            console.log('Login successful');
            this.router.navigateByUrl('features/dashboard');
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Login failed:', error);
        },
      });
    }
  }

  // Handle Google Sign-In callback
  handleGoogleSignIn(response: any): void {
    console.log('Google Sign-In Response:', response);

    // Send the ID token to the backend for validation
    this.authService.googleLogin(response).subscribe({
      next: (isAuthenticated) => {
        if (isAuthenticated) {
          console.log('Google login successful');
          this.router.navigate(['/features/dashboard']);
        } else {
          console.error('Google login failed');
        }
      },
      error: (error) => {
        console.error('Google login error:', error);
      },
    });
  }

  // Navigate to the registration page
  register(): void {
    this.router.navigateByUrl('/auth/register');
  }
}
