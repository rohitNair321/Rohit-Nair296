import { NgModule } from '@angular/core';
import { NavigationStart, Router, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'features', loadChildren: () => import('./features/landing.module').then(m => m.LandingModule) },
  { path: 'profile-menu', loadChildren: () => import('./features/profile-menu/menu.module').then(m => m.MenuModule) },
  { path: '**', redirectTo: 'auth/login' }  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private router: Router){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.handleRoutingSession(event.url);
      }
    });
  }

  handleRoutingSession(event: string){
    if(event == '/auth/login' && sessionStorage.getItem('accessToken')){
      sessionStorage.clear();
    }
  }
}
