
import { LoginComponent } from './auth/login/login.component';
import { TaskListComponent } from './landing/task-list/task-list.component';
import { NgModule } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterModule, Routes } from '@angular/router';
import { AuthGardService } from './Services/auth-gard.service';
import { TaskDetailsComponent } from './landing/task-details/task-details.component';
const routes: Routes = [
  // { path: '', component: LoginComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
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
        event.url == '/auth/login'?sessionStorage.removeItem('accessToken'):'do nothing';
        // this.showLoading = true; // Show loading indicator
      }
    });
  }
}
