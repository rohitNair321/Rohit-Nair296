import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { OrderListModule } from 'primeng/orderlist';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    TaskDetailsComponent,
    TaskFormComponent,
    TaskListComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ButtonModule,
    OrderListModule,
    TooltipModule,
    DropdownModule,
    InputTextModule,
    ToastModule,    
    DialogModule,
    MenubarModule,
  ],
})
export class LandingModule { }
