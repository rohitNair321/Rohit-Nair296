import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { GoogleLoginProvider, SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environments';
import { TodoInterceptor } from './interceptors/todo.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    ProfilePopupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,  
    LandingModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule
  ],
  exports: [
    ProfilePopupComponent
  ],
  providers: [
    AuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId) // Use hardcoded Client ID
          }
        ]
      } as SocialAuthServiceConfig
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TodoInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
