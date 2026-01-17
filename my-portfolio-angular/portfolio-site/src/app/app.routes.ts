import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { tokenGuard } from './core/app-gards/token.guard';
import { PageNotFoundComponent } from './layouts/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    // canActivate: [tokenGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.component').then(m => m.RegisterComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./auth/forgot-password/forgot-password.component')
            .then(m => m.ForgotPasswordComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./auth/reset-password/reset-password.component')
            .then(m => m.ResetPasswordComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login', // relative redirect (no leading slash!)
      },
    ],
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [tokenGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile-shell/profile-shell.component')
            .then(m => m.ProfileShellComponent),
        // canActivate: [tokenGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(m => m.SettingsComponent),
        // canActivate: [tokenGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notification/notification.component').then(m => m.NotificationComponent),
        canActivate: [tokenGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'resume',
        loadComponent: () =>
          import('./features/view-resume/view-resume.component')
            .then(m => m.ViewResumeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about-me/about-me.component').then(m => m.AboutMeComponent),
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./features/help/help.component').then(m => m.HelpComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects-page/projects-page.component')
            .then(m => m.ProjectsPageComponent),
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];