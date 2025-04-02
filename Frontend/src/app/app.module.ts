import { NgModule } from '@angular/core';
import { BrowserModule,  } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './Components/footer/footer.component';
import { ProfilePopupComponent } from './Components/profile-popup/profile-popup.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { LandingModule } from './landing/landing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './Services/error.service';
import { AuthService } from './Services/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    // LoginComponent,
    ProfilePopupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,  
    LandingModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  exports: [
    ProfilePopupComponent
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS,useClass: AuthInterceptor,multi: true}
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
