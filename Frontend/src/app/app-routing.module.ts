
import { LoginComponent } from './Compoments/login/login.component';
import { TaskListComponent } from './Compoments/task-list/task-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'task-list', component: TaskListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
