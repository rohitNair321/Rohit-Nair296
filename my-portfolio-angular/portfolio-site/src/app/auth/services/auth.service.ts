import { inject, Injectable, signal } from '@angular/core';
import { catchError, debounceTime, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { UserRole } from 'src/app/core/services/app.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  role = signal<UserRole>(null);
  private readonly baseUrl = ''; //api/auth
  private readonly apiBaseUrl = environment.baseUrl + '/api/auth';
  user = signal<any | null>(null);
  token = signal<string | null>(null);

  // Fetch profile data from Json.
  getCombinedData(): Observable<any> {
    return this.http.get<any>('assets/data/profile.json').pipe(
      debounceTime(100)
    );
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/register`, payload);
  }

  login(payload: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/login`, payload).pipe(
      map((res) => {
        this.token.set(res.token);
        this.user.set(res.user);
        this.localStorageService.setItem('auth_token', res.token);
        return res;
      })
    );
  }

  loginWithGoogle(): Observable<any> {
    // TODO: integrate Google OAuth / Supabase OAuth
    console.log('Login with Google called');
    return of({ success: true });
  }

  loginWithFacebook(): Observable<any> {
    // TODO: integrate Facebook OAuth / Supabase OAuth
    console.log('Login with Facebook called');
    return of({ success: true });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/reset-password`, { token, password });
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    this.role.set(null);
    this.localStorageService.clear();
    location.href = '/login';
  }

}
