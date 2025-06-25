import { Component } from '@angular/core';
import { defaultConfig, LayoutConfig } from 'src/app/core/config/layout.config';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  config: LayoutConfig = defaultConfig;
  isSidebarCollapsed = false;
  isDarkTheme = false;

  constructor() {
    // You can modify the config here if needed
    this.config.navigation.type = 'navbar'; // Example of changing primary color
    this.config.navigation.theme = 'light';
  }
}
