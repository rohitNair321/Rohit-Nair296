import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { HomeComponent } from './features/home/home.component';
import { AboutMeComponent } from './features/about-me/about-me.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about-me', component: AboutMeComponent },
      { path: '**', redirectTo: '' }
      // {
      //   path: 'home',
      //   loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      // },
      // {
      //   path: 'about',
      //   loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule)
      // },
      // {
      //   path: 'portfolio',
      //   loadChildren: () => import('./features/portfolio/portfolio.module').then(m => m.PortfolioModule)
      // },
      // {
      //   path: 'contact',
      //   loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule)
      // }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      // Auth routes here
    ],
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
