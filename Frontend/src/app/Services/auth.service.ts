import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:5000/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private router:Router, private http: HttpClient) { }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  public login(loginDetails: any): Observable<boolean> {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/login`, loginDetails, {headers}).pipe(
      map(response => {
        if(response && response.token){
          sessionStorage.setItem('loginUserName', response.user.firstName + ' ' + response.user.lastName);
          sessionStorage.setItem('accessToken', response.token);
          this.isAuthenticatedSubject.next(true);
          return true;
        }else{
          return false;
        }
      })
    );
  }

  public register(newUserDetails: RegisterDTO): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${this.apiUrl}/register`, newUserDetails, {headers}).pipe(
      map(response =>{
        return response;
      })
    );
  }

  logout(token: any): Observable<any> {
    // const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        sessionStorage.removeItem('token');
        sessionStorage.clear();
        this.isAuthenticatedSubject.next(false);
      })
    );
  }

  public isLoggedIn(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }
}


export class RegisterDTO {
  public firstName: string | undefined;
  public lastName: string | undefined;
  public username: string | undefined;
  public email: string | undefined;
  public password: string | undefined;
}