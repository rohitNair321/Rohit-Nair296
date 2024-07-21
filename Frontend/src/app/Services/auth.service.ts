import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:5046';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private router:Router, private http: HttpClient) { }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  public login(loginDetails: any): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/login`, loginDetails, {headers}).pipe(
      map(response => {
        if(response && response.token){
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

  private authenticate(username: string, password: string): boolean {
    if(username === "admin" && password === "admin@123"){
      const dummyToken = "dummyToken";
      sessionStorage.setItem('accessToken', dummyToken);
      return true;
    }else{
      return false;
    }
  }

  public logout(){
    sessionStorage.removeItem('accessToken');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }
}
