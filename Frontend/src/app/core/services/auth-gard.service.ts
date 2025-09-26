import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGardService {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    
    this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}