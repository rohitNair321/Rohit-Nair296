import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.token() || localStorage.getItem('auth_token');
  const isLoggedIn = !!token && token.length > 0;

  if (isLoggedIn) {
    // Redirect to main layout if already logged in
    router.navigate(['/app']);
    return false;
  }
  return true;
};