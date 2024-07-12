import { ɵparseCookieValue } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private router:Router, private http: HttpClient) { }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  public login(loginDetails: any): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('http://localhost:5047/login', loginDetails, {headers}).pipe(
      map(response => {
        if(response && response.token){
          localStorage.setItem('accessToken', response.token);
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
      localStorage.setItem('accessToken', dummyToken);
      return true;
    }else{
      return false;
    }
  }

  public logout(){
    localStorage.removeItem('accessToken');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}
