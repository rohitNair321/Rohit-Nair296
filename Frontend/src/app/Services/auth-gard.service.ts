import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGardService {

  constructor(private auth:AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    this.auth.isLoggedIn() == false?this.router.navigateByUrl('/'):this.auth.isLoggedIn();
    // this.auth.isLoggedIn() == false?this.router.navigate(['/auth/login']):this.router.navigate(['/landing/task-list']);
    return this.auth.isLoggedIn();
  }

}
