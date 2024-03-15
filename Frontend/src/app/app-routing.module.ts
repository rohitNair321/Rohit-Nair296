
import { LoginComponent } from './Components/login/login.component';
import { TaskListComponent } from './Components/task-list/task-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGardService } from './Services/auth-gard.service';
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  { path: 'task-list', component: TaskListComponent, canActivate: [AuthGardService] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
