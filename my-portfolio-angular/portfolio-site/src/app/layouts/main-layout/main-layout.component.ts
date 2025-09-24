import { Component } from '@angular/core';
import { defaultConfig, LayoutConfig } from 'src/app/core/config/layout.config';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  config: LayoutConfig = defaultConfig;
  isSidebarCollapsed = true;
  isDarkTheme = false;

  constructor() {
    // Example configuration for sidebar
    this.config.appConfiguration.type = 'sidebar';
    this.config.appConfiguration.theme = 'light';
    this.config.appConfiguration.sidebarPosition = 'right'; // 'left' or 'right'
    this.config.appConfiguration.collapsed = true;
    this.config.appConfiguration.showSidebarToggle = true;
    this.config.appConfiguration.showAgentChat = true;
    this.config.appConfiguration.showUserProfileView = true;
  }

  initSidebarMenu(sidebarEvent: any){
    this.isSidebarCollapsed = sidebarEvent;
    this.config.appConfiguration.collapsed = sidebarEvent;
    this.config.theme.name = 'theme-1'; // default-theme
  }
}