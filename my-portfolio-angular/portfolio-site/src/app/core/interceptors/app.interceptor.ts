// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();

  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 401) {
        // Optionally clear auth state
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        auth.token.set(null);
        auth.user.set(null);
        // Redirect to login
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
