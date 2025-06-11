import { NgModule } from '@angular/core';
import { NavigationStart, Router, RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGardService } from './core/services/auth-gard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'features',
    component: MainLayoutComponent,
    canActivate: [AuthGardService],
    loadChildren: () => import('./features/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'profile-menu',
    component: MainLayoutComponent,
    canActivate: [AuthGardService],
    loadChildren: () => import('./features/profile-menu/menu.module').then(m => m.MenuModule)
  },
  { 
    path: '**', 
    redirectTo: 'auth/login' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.handleRoutingSession(event.url);
      }
    });
  }

  handleRoutingSession(event: string) {
    if(event == '/auth/login' && sessionStorage.getItem('accessToken')) {
      sessionStorage.clear();
    }
  }
}
