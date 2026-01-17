import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AppService } from "../services/app.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";

export const tokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const appService = inject(AppService);
  const authService = inject(AuthService);
  const localStorageService = inject(LocalStorageService);

  const token = authService.token() || localStorageService.getItem('auth_token');
  appService.setRole(token? appService.role() || 'ADMIN':appService.role() || 'GUEST')
  const role = token? appService.role() || 'ADMIN':appService.role() || 'GUEST'; // This is your Signal

  // If the user is an ADMIN, they MUST have a token
  if (role === 'ADMIN') {
    if (token) return true;
    router.navigate(['/login']);
    return false;
  }

  // If the user is a GUEST, allow access to non-admin routes
  if (role === 'GUEST') {
    const isAdminRoute = route.data?.['roles']?.includes('ADMIN');
    if (isAdminRoute) {
      router.navigate(['/app/home']); // Guests trying to hit Admin pages go to Home
      return false;
    }
    return true; // Guests allowed on public routes
  }

  // If no role is set (Initial load/Refresh), redirect to login
  router.navigate(['/login']);
  return false;
};