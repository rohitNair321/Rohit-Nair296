import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { AppService } from '../services/app.service';
import { AuthService } from 'src/app/auth/services/auth.service';

export const tokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const appService = inject(AppService);
  const authService = inject(AuthService);

  const authFirst = environment.authFirst;
  const hasToken = authFirst?!!authService.token() || localStorage.getItem("auth_token"):!!appService.token() || localStorage.getItem("auth_token");
  const url = state.url;

  // 🔹 PUBLIC-FIRST MODE
  // Token is fetched at bootstrap via APP_INITIALIZER
  if (!authFirst) {
    if (!hasToken) {
      // App not ready yet → block navigation
      return false;
    }
    return true;
  }

  // 🔹 AUTH-FIRST MODE
  if (authFirst) {
    // Trying to access auth pages
    if (url.startsWith('/login') || url.startsWith('/register') || url.startsWith('/auth')) {
      if (hasToken) {
        router.navigate(['/app']);
        return false;
      }
      return true;
    }

    // Trying to access app pages
    if (!hasToken) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  }

  return true;
};
