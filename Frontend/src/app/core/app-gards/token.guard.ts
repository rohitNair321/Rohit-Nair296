import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AppService } from "../services/app.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { map } from "rxjs";

export const tokenGuard: CanActivateFn = (route, _state) => {
  const router      = inject(Router);
  const authService = inject(AuthService);
  const appService  = inject(AppService);

  return authService.initiateApp().pipe(
    map(() => {
      const role = appService.role();
      const isAdminRoute = route.data?.['roles']?.includes('ADMIN');

      if (isAdminRoute && role !== 'ADMIN') {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );
};
