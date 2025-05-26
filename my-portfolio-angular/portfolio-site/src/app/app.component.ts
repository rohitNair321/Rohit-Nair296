import { Component } from '@angular/core';
import { defaultConfig, LayoutConfig } from './core/config/layout.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'portfolio-site';
  config: LayoutConfig = defaultConfig;

  constructor(){}


}
