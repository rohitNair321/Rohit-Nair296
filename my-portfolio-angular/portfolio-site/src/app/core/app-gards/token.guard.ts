import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AppService } from "../services/app.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { map, catchError, of, tap } from "rxjs";
import { CommonApp } from "../services/common";

/**
 * Token Guard with Persistent Session Caching
 * 
 * - Checks localStorage for cached role (persists across refreshes)
 * - Only calls initiateApp() if no cached session exists
 * - Validates admin routes based on cached or fetched role
 * - Prevents unnecessary API calls on every navigation
 */
export const tokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const appService = inject(AppService);
  const localStorage = inject(LocalStorageService);
  const themeService = inject(CommonApp);

  // Check for cached role in localStorage (persists across refreshes)
  const cachedRole = appService.role();
  const hasToken = !!localStorage.getItem('auth_token');
  const isAdminRoute = route.data?.['roles']?.includes('ADMIN');
  
  // If we have a cached role, use it (no API call needed)
  if (cachedRole) {
    console.log('🔒 Using cached session:', cachedRole);
    
    // Admin trying to access admin route with token - allow
    if (isAdminRoute && cachedRole === 'ADMIN' && hasToken) {
      return true;
    }
    
    // Admin trying to access admin route without token - re-init
    if (isAdminRoute && cachedRole === 'ADMIN' && !hasToken) {
      console.log('⚠️ Admin role cached but no token, re-initializing...');
      appService.clearRole(); // Clear stale role
      // Fall through to init
    }
    // Guest trying to access admin route - block
    else if (isAdminRoute && cachedRole === 'GUEST') {
      router.navigate(['/login']);
      return false;
    }
    // Non-admin route - allow
    else if (!isAdminRoute) {
      return true;
    }
  }

  // No cached session or need to re-validate - call backend
  console.log('🔄 Initializing session from backend...');
  
  return authService.initiateApp().pipe(
    tap(() => console.log('✅ Session initialized from backend')),
    map((res: any) => {
      const role = res?.role === 'admin' ? 'ADMIN' : "GUEST";
      appService.setRole(role); // This now persists to localStorage
      
      // Apply theme if available
      if (res?.appData) {
        themeService.applyThemeFromProfile(res.appData);
      }

      // Check access for admin routes
      if (isAdminRoute && role !== 'ADMIN') {
        console.log('❌ Admin route blocked for:', role);
        router.navigate(['/login']);
        return false;
      }
      
      console.log('✅ Access granted for:', role);
      return true;
    }),
    catchError((error) => {
      console.warn('⚠️ Session init failed, defaulting to GUEST', error);
      
      appService.setRole('GUEST');
      
      if (isAdminRoute) {
        router.navigate(['/login']);
        return of(false);
      }
      return of(true); 
    })
  );
};