import { Component, Input, OnInit, OnDestroy, HostBinding, Output, EventEmitter, Injector, computed } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BadgeModule } from 'primeng/badge';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { CommonApp } from 'src/app/core/services/common';
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
    MenuModule,
    BadgeModule,
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

  notifications = computed(() => {
    return (
      this.appService.notifications()
    );
  });

  constructor(public override injector: Injector) {
    super(injector);
  }

  ngOnInit() {
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