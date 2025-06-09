import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent,
    // Add shared pipes/directives here
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule
  ],
  exports: [
    NavigationComponent,
    FooterComponent,
    // Export shared pipes/directives here
  ]
})
export class SharedModule { }
