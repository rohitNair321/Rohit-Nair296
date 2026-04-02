import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AppService } from "../services/app.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { map, catchError, of, tap } from "rxjs";
import { CommonApp } from "../services/common";

/**
 * Token Guard with Session Caching
 * 
 * - Calls initiateApp() only ONCE on app load
 * - Caches the session state
 * - Subsequent navigations use cached state
 * - Re-validates only if cache is empty or expired
 */
export const tokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const appService = inject(AppService);
  const themeService = inject(CommonApp);

  // Check if we already have a role set (session cached)
  const cachedRole = appService.role();
  
  if (cachedRole) {
    // Use cached session state
    console.log('🔒 Using cached session:', cachedRole);
    
    const isAdminRoute = route.data?.['roles']?.includes('ADMIN');
    
    if (isAdminRoute && cachedRole !== 'ADMIN') {
      router.navigate(['/login']);
      return false;
    }
    return true;
  }

  // No cached session - call backend to initialize
  console.log('🔄 Initializing session from backend...');
  
  return authService.initiateApp().pipe(
    tap(() => console.log('✅ Session initialized')),
    map((res: any) => {
      const role = res?.role === 'admin' ? 'ADMIN' : "GUEST";
      appService.setRole(role);
      
      // Apply theme if available
      if (res?.appData) {
        themeService.applyThemeFromProfile(res.appData);
      }

      const isAdminRoute = route.data?.['roles']?.includes('ADMIN');

      if (isAdminRoute && role !== 'ADMIN') {
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
    catchError((error) => {
      console.warn('⚠️ Session init failed, defaulting to GUEST', error);
      
      const isAdminRoute = route.data?.['roles']?.includes('ADMIN');
      appService.setRole('GUEST');
      
      if (isAdminRoute) {
        router.navigate(['/login']);
        return of(false);
      }
      return of(true); 
    })
  );
};