import { ɵparseCookieValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private router:Router) { }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  public login(loginDetails: any): void {
    const isAuthenticated = this.authenticate(loginDetails.username, loginDetails.password);
    this.isAuthenticatedSubject.next(isAuthenticated);
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
  }

  public isLoggedIn(): boolean {
     if(!!localStorage.getItem('token')){
      return false;
     }else{
      return true;
     }
  }
}
