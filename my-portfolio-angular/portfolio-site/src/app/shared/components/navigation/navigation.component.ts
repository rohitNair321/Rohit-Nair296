import { Component, Input, OnInit, OnDestroy, HostBinding, Output, EventEmitter, Injector } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { CommonApp } from 'src/app/core/services/common';
import { AppService } from 'src/app/core/services/app.service';
import { ThemeService } from 'src/app/core/theme/theme.service';
import { MenuModule } from "primeng/menu";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    RadioButtonModule,
    ButtonModule,
    ProfileMenuComponent,
    MenuModule
],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent extends CommonApp implements OnInit, OnDestroy {
  @Input() config: any;
  isMobile = false;
  isMenuOpen = false;
  darkTheme = false;
  @Output() isSidebarCollapsedChange = new EventEmitter<boolean>();

  @HostBinding('class.sidebar-left') get sidebarLeft() {
    return this.config?.appConfiguration?.type === 'sidebar' && this.config?.appConfiguration?.sidebarPosition === 'left';
  }

  @HostBinding('class.sidebar-right') get sidebarRight() {
    return this.config?.appConfiguration?.type === 'sidebar' && this.config?.appConfiguration?.sidebarPosition === 'right';
  }

  menuItems = [
    { label: 'Home', href: '#home', icon: 'home' },
    { label: 'About', href: '#about', icon: 'person' },
    { label: 'Projects', href: '#projects', icon: 'work' },
    { label: 'Contact', href: '#contact', icon: 'mail' },
  ];

  constructor(public override injector: Injector, private breakpointObserver: BreakpointObserver) {
    super(injector);
  }

  ngOnInit() {
    this.setupResponsiveBehavior();
    // this.darkTheme = this.initializeTheme();
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile.bind(this));

    // Initialize sidebar state
    if (this.config?.appConfiguration?.type === 'sidebar') {
      this.config.appConfiguration.collapsed = this.config?.appConfiguration?.collapsed || false;
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkMobile.bind(this));
  }

  private setupResponsiveBehavior() {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.isMobile = result.matches;
      if (!this.isMobile) this.isMenuOpen = false;
    });
  }

  // private initializeTheme() {
  //   this.isDarkTheme = this.config.appConfiguration.theme == 'dark' ? true : false;
  //   this.isDarkTheme = document.body.classList.toggle('dark-mode', this.isDarkTheme);
  // }

  checkMobile() {
    this.isMobile = window.innerWidth <= 900;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
    this.config.appConfiguration.isMobile = this.isMobile;
  }

  toggleMenu() {
    if (this.config?.appConfiguration?.type === 'navbar') {
      this.isMenuOpen = !this.isMenuOpen;
    } else if (this.config?.appConfiguration?.type === 'sidebar') {
      this.config.appConfiguration.collapsed = !this.config.appConfiguration.collapsed;
      this.isSidebarCollapsedChange.emit(this.config.appConfiguration.collapsed);
    }
  }

  toggleSidebar() {
    if (!this.isMobile) {
      this.config.appConfiguration.collapsed = !this.config.appConfiguration.collapsed;
    }
  }

  // get isDarkTheme(): boolean {
  //   return this.themeService.isDarkTheme();
  // }

  toggleTheme() {
    this.themeToggle();
  }

  // Add this method for smooth scrolling
  // scrollToSection(event: Event, href: string) {
  //   event.preventDefault();
  //   const element = document.querySelector(href);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //     if (this.isMobile) this.isMenuOpen = false;
  //   }
  // }
}