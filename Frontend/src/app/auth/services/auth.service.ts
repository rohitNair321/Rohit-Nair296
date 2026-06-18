import { inject, Injectable, signal } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { AppService, UserRole } from 'src/app/core/services/app.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, MOCK_PROFILE } from 'src/app/core/mock-data/mock-data';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private localStorageService = inject(LocalStorageService);
  private router              = inject(Router);
  public  appService          = inject(AppService);

  role  = signal<UserRole>(null);
  user  = signal<any | null>(null);
  token = signal<string | null>(null);

  // Fetch static profile data from JSON (still used by some components)
  getCombinedData(): Observable<any> {
    return of({ home: { hero: { name: MOCK_PROFILE.full_name } } });
  }

  register(payload: RegisterRequest): Observable<any> {
    // Demo: always succeeds, store name so profile can show it
    return of({ success: true, data: { user: { name: payload.name, email: payload.email } } }).pipe(delay(500));
  }

  login(payload: LoginRequest): Observable<any> {
    const isAdmin = payload.email.toLowerCase() === DEMO_ADMIN_EMAIL &&
                    payload.password === DEMO_ADMIN_PASSWORD;
    const role: UserRole = isAdmin ? 'ADMIN' : 'GUEST';

    if (!payload.email || !payload.password) {
      return new Observable(obs => {
        obs.error({ error: { message: 'Email and password are required.' } });
      });
    }

    const fakeToken = isAdmin ? `demo-admin-token-${Date.now()}` : `demo-guest-token-${Date.now()}`;

    this.token.set(fakeToken);
    this.user.set({ email: payload.email, role: isAdmin ? 'admin' : 'guest' });
    this.role.set(role);
    this.appService.setRole(role);

    if (isAdmin) {
      this.localStorageService.setItem('auth_token', fakeToken);
      this.localStorageService.setItem('user_role', 'ADMIN');
    } else {
      this.localStorageService.setItem('user_role', 'GUEST');
    }

    return of({ success: true, data: { token: fakeToken, user: { role: isAdmin ? 'admin' : 'guest', email: payload.email } } }).pipe(delay(400));
  }

  // Called on app startup — restores session from localStorage
  initiateApp(): Observable<any> {
    const storedRole  = this.localStorageService.getItem('user_role') as UserRole;
    const storedToken = this.localStorageService.getItem('auth_token');
    const role: UserRole = storedRole === 'ADMIN' && !!storedToken ? 'ADMIN' : 'GUEST';

    this.role.set(role);
    this.appService.setRole(role);

    return of({
      data: { role: role === 'ADMIN' ? 'admin' : 'guest', id: 'demo-user-001', email: MOCK_PROFILE.email, appData: null }
    });
  }

  loginWithGoogle(): Observable<any> {
    return this.login({ email: 'guest@demo.com', password: 'guest' });
  }

  loginWithFacebook(): Observable<any> {
    return this.login({ email: 'guest@demo.com', password: 'guest' });
  }

  forgotPassword(_email: string): Observable<any> {
    return of({ success: true, message: 'If that email is registered, a reset link has been sent. (demo mode)' }).pipe(delay(600));
  }

  resetPassword(_token?: string, _password?: string): Observable<any> {
    return of({ success: true, message: 'Password has been reset. (demo mode)' }).pipe(delay(500));
  }

  updatePassword(_passwordData: FormData): Observable<any> {
    return of({ success: true, message: 'Password updated. (demo mode)' }).pipe(delay(500));
  }

  logoutState(): void {
    this.user.set(null);
    this.role.set(null);
    this.token.set(null);
    this.appService.setRole('GUEST');
    this.appService._profile.set(null);
    this.localStorageService.removeItem('auth_token');
    this.localStorageService.removeItem('user_role');
  }

  logout(): void {
    this.logoutState();
    this.router.navigate(['/']);
  }
}
