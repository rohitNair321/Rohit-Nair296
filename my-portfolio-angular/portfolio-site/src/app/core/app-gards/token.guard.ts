import { CanActivateFn, Router } from "@angular/router";
import { AppService } from "../services/app.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { inject } from "@angular/core";
import { environment } from "src/environments/environments";

// token.guard.ts
export const tokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const appService = inject(AppService);
  const url = state.url;

  // const isAuthorized = appService.isAuthorized();
  const currentRole = appService.role(); // 'ADMIN' or 'GUEST' or null
  const isAuthorized = !!currentRole;

  // 1. If trying to access Login/Register while already authorized
  if (url.includes('/login') || url.includes('/register')) {
    if (currentRole === 'ADMIN') {
      router.navigate(['/app/home']);
      return false;
    }
    return true;
  }

  // 2. Protect App Pages
  if (!isAuthorized) {
    router.navigate(['/login']);
    return false;
  }

  // 3. Role-Based Check for specific pages
  const restrictedRoles = route.data['roles'] as Array<string>;

  // If the page has restricted roles and the user's role isn't included
  if (restrictedRoles && !restrictedRoles.includes(currentRole!)) {
    // Redirect Guests away from Admin pages back to Home
    router.navigate(['/app/home']);
    return false;
  }

  return true;
};