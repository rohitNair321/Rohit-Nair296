import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppService } from 'src/app/core/services/app.service';
import { AlertService } from '../services/alert.service'; // Adjust path
import { LoadingService } from '../services/loading.service'; // Adjust path

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const app = inject(AppService);
  const router = inject(Router);
  const alert = inject(AlertService);
  const loading = inject(LoadingService);
  const token = auth.token();

  // Example: Add another header, e.g., X-User-Role
  const role = auth.role ? auth.role() : undefined; // Assumes AuthService has a role() method
  const setHeaders: any = {};
  if (token) {
    setHeaders['Authorization'] = `Bearer ${token}`;
  }
  if (role) {
    setHeaders['X-User-Role'] = role;
  }
  const cloned = Object.keys(setHeaders).length > 0
    ? req.clone({ setHeaders })
    : req;

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      // 2. Handle Specific Status Codes
      switch (err.status) {
        case 401:
          // Unauthorized: Clear session and redirect
          alert.showAlert('Login Id or password is incorrect. Please try again.', 'success');
          auth.logout(); // Assuming you have a logout method that clears signals/localStorage
          router.navigate(['/login']);
          break;

        case 403:
          // Forbidden
          alert.showAlert('You do not have permission to perform this action.', 'warning');
          break;

        case 400:
          // Bad Request (Validation errors)
          const msg = err.error?.message || 'Invalid request. Please check your data.';
          alert.showAlert(msg, 'error');
          break;

        case 500:
          // Server Error
          alert.showAlert('Server error! Our team has been notified.', 'error');
          break;

        default:
          alert.showAlert('An unexpected error occurred.', 'error');
          break;
      }

      return throwError(() => err);
    }),
    finalize(() => {
      // 3. Always hide spinner when request finishes (success or error)
      loading.hide();
    })
  );
};