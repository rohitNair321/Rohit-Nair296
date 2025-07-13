import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './components/navigation/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent,
    SidebarComponent,
    ChatBotComponent,
    // Add shared pipes/directives here
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    NavigationComponent,
    FooterComponent,
    SidebarComponent,
    ChatBotComponent
    // Export shared pipes/directives here
  ]
})
export class SharedModule { }
