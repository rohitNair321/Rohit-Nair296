import { Routes } from '@angular/router';

// Layouts (standalone)
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
      { path: 'overview', loadComponent: () => import('./features/overview/overview.component').then(m => m.OverviewComponent) },
      { path: 'profile', loadComponent: () => import('./features/profile-shell/profile-shell.component').then(m => m.ProfileShellComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'resume', loadComponent: () => import('./features/view-resume/view-resume.component').then(m => m.ViewResumeComponent) },
      { path: 'about', loadComponent: () => import('./features/about-me/about-me.component').then(m => m.AboutMeComponent) },
      { path: 'help', loadComponent: () => import('./features/help/help.component').then(m => m.HelpComponent) },
    ],
  },

  // Auth area (add your auth pages here)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      // Example:
      // { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      // { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
      { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
    ],
  },

  { path: '**', redirectTo: '' },
];
