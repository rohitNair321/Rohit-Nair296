import { Component } from '@angular/core';
import { defaultConfig, LayoutConfig } from 'src/app/core/config/layout.config';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  config: LayoutConfig = defaultConfig;
}
