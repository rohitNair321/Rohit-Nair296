import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { environment } from 'src/environments/environments';
import { authGuard } from './core/app-gards/auth-guard';
import { guestGuard } from './core/app-gards/guest-guard';

const AUTH_FIRST = environment.authFirst; // move to env later

const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
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
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/overview/overview.component').then(m => m.OverviewComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile-shell/profile-shell.component')
            .then(m => m.ProfileShellComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(m => m.SettingsComponent),
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
  // Modal outlet route: /(modal:project/123)
  {
    path: 'project/:id',
    outlet: 'modal',
    loadComponent: () =>
      import('./shared/components/dialogs/project-dialog-route-bridge.component')
        .then(m => m.ProjectDialogRouteBridgeComponent),
  },
];
const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/overview/overview.component').then(m => m.OverviewComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile-shell/profile-shell.component')
            .then(m => m.ProfileShellComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(m => m.SettingsComponent),
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
  {
    path: 'auth',
    component: AuthLayoutComponent,
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
        path: '',
        pathMatch: 'full',
        redirectTo: 'login', // relative redirect (no leading slash!)
      },
    ],
  },
  // Modal outlet route: /(modal:project/123)
  {
    path: 'project/:id',
    outlet: 'modal',
    loadComponent: () =>
      import('./shared/components/dialogs/project-dialog-route-bridge.component')
        .then(m => m.ProjectDialogRouteBridgeComponent),
  },
];

// export const routes: Routes = [
//   // Main portfolio area – stays as-is, landing on HomeComponent
//   {
//     path: '',
//     component: MainLayoutComponent,
//     children: [
//       {
//         path: '',
//         loadComponent: () =>
//           import('./features/home/home.component').then(m => m.HomeComponent),
//       },
//       {
//         path: 'overview',
//         loadComponent: () =>
//           import('./features/overview/overview.component').then(m => m.OverviewComponent),
//       },
//       {
//         path: 'profile',
//         loadComponent: () =>
//           import('./features/profile-shell/profile-shell.component')
//             .then(m => m.ProfileShellComponent),
//       },
//       {
//         path: 'settings',
//         loadComponent: () =>
//           import('./features/settings/settings.component').then(m => m.SettingsComponent),
//       },
//       {
//         path: 'resume',
//         loadComponent: () =>
//           import('./features/view-resume/view-resume.component')
//             .then(m => m.ViewResumeComponent),
//       },
//       {
//         path: 'about',
//         loadComponent: () =>
//           import('./features/about-me/about-me.component').then(m => m.AboutMeComponent),
//       },
//       {
//         path: 'help',
//         loadComponent: () =>
//           import('./features/help/help.component').then(m => m.HelpComponent),
//       },
//       {
//         path: 'projects',
//         loadComponent: () =>
//           import('./features/projects-page/projects-page.component')
//             .then(m => m.ProjectsPageComponent),
//       },
//     ],
//   },

//   // Modal outlet route: /(modal:project/123)
//   {
//     path: 'project/:id',
//     outlet: 'modal',
//     loadComponent: () =>
//       import('./shared/components/dialogs/project-dialog-route-bridge.component')
//         .then(m => m.ProjectDialogRouteBridgeComponent),
//   },

//   // Auth area – now wired properly
//   {
//     path: 'auth',
//     component: AuthLayoutComponent,
//     children: [
//       {
//         path: 'login',
//         loadComponent: () =>
//           import('./auth/login/login.component').then(m => m.LoginComponent),
//       },
//       {
//         path: 'register',
//         loadComponent: () =>
//           import('./auth/register/register.component').then(m => m.RegisterComponent),
//       },
//       {
//         path: 'forgot-password',
//         loadComponent: () =>
//           import('./auth/forgot-password/forgot-password.component')
//             .then(m => m.ForgotPasswordComponent),
//       },
//       {
//         path: '',
//         pathMatch: 'full',
//         redirectTo: 'login', // relative redirect (no leading slash!)
//       },
//     ],
//   },

//   { path: '**', redirectTo: '' },
// ];

export const routes: Routes = AUTH_FIRST?
AUTH_ROUTES:MAIN_ROUTES;