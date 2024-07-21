import { NgModule } from '@angular/core';
import { BrowserModule,  } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './Components/footer/footer.component';
import { ProfilePopupComponent } from './Components/profile-popup/profile-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { LandingModule } from './landing/landing.module';
import { AppComponent } from './app.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
