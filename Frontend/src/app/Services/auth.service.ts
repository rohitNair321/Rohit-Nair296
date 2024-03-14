import { ɵparseCookieValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  public login(username: string, password: string):boolean {
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
    return !!localStorage.getItem('token');
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGard implements CanActivate {

  constructor(private router:Router, private auth: AuthService){ }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(this.auth.isLoggedIn()){
      return true;
    }else{
      return false;
    }
  }

}

export interface User {
  username?: string | undefined;
  password?: string | undefined;
}