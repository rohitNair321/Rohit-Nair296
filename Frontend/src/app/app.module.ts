import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { TaskListComponent } from './Components/task-list/task-list.component';
import { TaskDetailsComponent } from './Components/task-details/task-details.component';
import { FooterComponent } from './Components/footer/footer.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { TaskFormComponent } from './Components/task-form/task-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePopupComponent } from './Components/profile-popup/profile-popup.component';
import { HttpClientModule } from '@angular/common/http';
import {DialogModule} from 'primeng/dialog';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskDetailsComponent,
    TaskFormComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    ProfilePopupComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    DialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
