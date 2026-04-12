import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AppService } from 'src/app/core/services/app.service';
import { AlertService } from '../services/alert.service'; // Adjust path
import { LoadingService } from '../services/loading.service'; // Adjust path
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const auth = inject(AuthService);
//   const app = inject(AppService);
//   const router = inject(Router);
//   const alert = inject(AlertService);
//   const loading = inject(LoadingService);
//   const localStorageService = inject(LocalStorageService);
//   const token = auth.token() || localStorageService.getItem('auth_token');

//   // Example: Add another header, e.g., X-User-Role
//   const role = auth.role ? auth.role() : undefined; // Assumes AuthService has a role() method
//   const setHeaders: any = {};
//   if (token) {
//     setHeaders['Authorization'] = `Bearer ${token}`;
//   }
//   if (role) {
//     setHeaders['X-User-Role'] = role;
//   }
//   const cloned = Object.keys(setHeaders).length > 0
//     ? req.clone({ setHeaders, withCredentials: true })
//     : req;

//   return next(cloned).pipe(
//     catchError((err: HttpErrorResponse) => {
//       // 2. Handle Specific Status Codes
//       switch (err.status) {
//         case 401:
//           // Unauthorized: Clear session and redirect
//           alert.showAlert('Login Id or password is incorrect. Please try again.', 'success');
//           auth.logout(); // Assuming you have a logout method that clears signals/localStorage
//           router.navigate(['/login']);
//           break;

//         case 403:
//           // Forbidden
//           alert.showAlert('You do not have permission to perform this action.', 'warning');
//           break;

//         case 400:
//           // Bad Request (Validation errors)
//           const msg = err.error?.message || 'Invalid request. Please check your data.';
//           alert.showAlert(msg, 'error');
//           break;

//         case 500:
//           // Server Error
//           alert.showAlert('Server error! Our team has been notified.', 'error');
//           break;

//         default:
//           alert.showAlert('An unexpected error occurred.', 'error');
//           break;
//       }

//       return throwError(() => err);
//     }),
//     finalize(() => {
//       // 3. Always hide spinner when request finishes (success or error)
//       loading.hide();
//     })
//   );
// };

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const alert = inject(AlertService);
  const loading = inject(LoadingService);

  const token = auth.token();
  const setHeaders: any = {};

  if (token) {
    setHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Always enable withCredentials so third-party cookies are transmitted!
  const cloned = req.clone({
    setHeaders,
    withCredentials: true
  });

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 401:
          // Soft logout: don't loop if we're on a public route. Only if accessing restricted profiles
          if (!router.url.includes('/login') && !router.url.includes('/home')) {
            alert.showAlert('Session expired. Please log in.', 'warning');
            auth.logoutState();
            router.navigate(['/login']);
          }
          break;
        case 403:
          alert.showAlert('Unauthorized access denied.', 'warning');
          break;
        case 500:
          alert.showAlert('Server error! Please try again later.', 'error');
          break;
      }
      return throwError(() => err);
    }),
    finalize(() => loading.hide())
  );
};