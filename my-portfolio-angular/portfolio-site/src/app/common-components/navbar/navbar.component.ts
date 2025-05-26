import { Component } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private themeService: ThemeService){

  }
  currentTheme!: boolean;
  toggleTheme(): void {
    this.currentTheme = this.themeService.toggleTheme();
  }
}
