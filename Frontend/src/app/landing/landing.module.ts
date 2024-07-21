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
import { NavbarComponent } from './navbar/navbar.component';
import { MenubarModule } from 'primeng/menubar';


@NgModule({
  declarations: [
    TaskDetailsComponent,
    TaskFormComponent,
    TaskListComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // HttpClientModule,
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
  exports: [
    NavbarComponent
  ]
})
export class LandingModule { }
