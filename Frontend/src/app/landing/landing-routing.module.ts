import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGardService } from '../Services/auth-gard.service';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskListComponent } from './task-list/task-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'task-list', component: TaskListComponent, canActivate: [AuthGardService] },
  { path: 'dashboard', component: DashboardComponent,  canActivate: [AuthGardService] },
  { path: 'task-details', component: TaskDetailsComponent, canActivate: [AuthGardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
