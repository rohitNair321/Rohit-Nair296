import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

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
          sessionStorage.setItem('loginUserName', response.user.username);
          sessionStorage.setItem('accessToken', response.token);
          this.isAuthenticatedSubject.next(true);
          return true;
        }else{
          return false;
        }
      })
    );
    // const isAuthenticated = this.authenticate(loginDetails.username, loginDetails.password);
    // this.isAuthenticatedSubject.next(isAuthenticated);
  }

  public register(newUserDetails: RegisterDTO): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${this.apiUrl}/register`, newUserDetails, {headers}).pipe(
      map(response =>{
        return response;
      })
    );
  }

  logout(token: any) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.apiUrl}/logout`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          sessionStorage.clear();
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['']);
        } else {
          console.error('Logout error:', xhr.statusText);
        }
      }
    };

    xhr.send();
  }

  public isLoggedIn(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }
}


export class RegisterDTO {
  public first_name: string | undefined;
  public last_name: string | undefined;
  public username: string | undefined;
  public email: string | undefined;
  public password: string | undefined;
}