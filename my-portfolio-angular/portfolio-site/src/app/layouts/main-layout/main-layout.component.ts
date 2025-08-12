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
    this.config.navigation.type = 'sidebar';
    this.config.navigation.theme = 'light';
    this.config.navigation.sidebarPosition = 'right'; // 'left' or 'right'
    this.config.navigation.collapsed = true;
  }

  initSidebarMenu(sidebarEvent: any){
    this.isSidebarCollapsed = sidebarEvent;
    this.config.navigation.collapsed = sidebarEvent;
    this.config.theme.name = 'theme-1'; // default-theme
  }
}