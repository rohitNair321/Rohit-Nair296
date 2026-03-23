import { inject, Injectable, signal } from '@angular/core';
import { catchError, debounceTime, forkJoin, map, mergeMap, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { AppService, UserRole } from 'src/app/core/services/app.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';
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
  private router = inject(Router);
  public appService = inject(AppService);

  role = signal<UserRole>(null);
  private readonly baseUrl = ''; //api/auth
  private readonly apiBaseUrl = environment.baseUrl + '/api/auth';
  private httpOptions = {
    withCredentials: true
  };
  user = signal<any | null>(null);
  token = signal<string | null>(null);

  private authHeaders(): any {
    // const token = this.token() || this.localStorageService.getItem('auth_token');
    // return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
    return this.httpOptions;
  }
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
    return this.http.post<any>(`${this.apiBaseUrl}/login`, payload, this.httpOptions).pipe(
      map((res) => {
        this.token.set(res.token);
        this.user.set(res.user);
        this.role.set(res.user.role === 'admin' ? 'ADMIN' : 'GUEST');
        this.appService.setRole(res.user.role === 'admin' ? 'ADMIN' : 'GUEST');
        this.localStorageService.setItem('auth_token', res.token);
      })
    );
  }

initiateApp(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/initApp`).pipe(
      tap((res: any) => {
        const role: UserRole = res.role === 'admin' ? 'ADMIN' : 'GUEST';
        this.role.set(role);
        this.appService.setRole(role);
        this.user.set({ email: res.email, id: res.id, role: res.role });
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
    return this.http.post(`${this.apiBaseUrl}/forgot-password`, { email }, this.httpOptions);
  }

  resetPassword(token?: string, password?: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/reset-password`, { token: this.localStorageService.getItem('auth_token'), password });
  }

  updatePassword(passwordData: FormData): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/update-password`, passwordData, this.httpOptions);
  }

  logoutState(): void {
    this.user.set(null);
    this.role.set(null);
    this.token.set(null);
    this.appService.setRole('GUEST');
    this.appService._profile.set(null);
    this.localStorageService.clear();
  }

  logout(): void {
    this.http.post(`${this.apiBaseUrl}/logout`, {}).subscribe({
      next: () => {
        this.logoutState();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.logoutState();
        this.router.navigate(['/login']);
      }
    });
  }

}
