import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Compoments/login/login.component';
import { TaskListComponent } from './Compoments/task-list/task-list.component';
import { TaskDetailsComponent } from './Compoments/task-details/task-details.component';
import { FooterComponent } from './Compoments/footer/footer.component';
import { NavbarComponent } from './Compoments/navbar/navbar.component';
import { TaskFormComponent } from './Compoments/task-form/task-form.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskDetailsComponent,
    TaskFormComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
