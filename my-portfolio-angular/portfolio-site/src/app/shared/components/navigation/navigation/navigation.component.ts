import { Component, Input, OnInit, OnDestroy, HostBinding, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  @Input() config: any;
  isMobile = false;
  isMenuOpen = false;
  isDarkTheme = false;
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

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.setupResponsiveBehavior();
    this.initializeTheme();
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

  private initializeTheme() {
    this.isDarkTheme = this.config.appConfiguration.theme == 'dark'?true:false;
    this.isDarkTheme = document.body.classList.toggle('dark-mode',this.isDarkTheme);
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 900;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
    this.config.appConfiguration.isMobile = this.isMobile;
  }

  toggleMenu() {
    if(this.config?.appConfiguration?.type === 'navbar') {
      this.isMenuOpen = !this.isMenuOpen;
    }else if(this.config?.appConfiguration?.type === 'sidebar') {
      this.config.appConfiguration.collapsed = !this.config.appConfiguration.collapsed;
      this.isSidebarCollapsedChange.emit(this.config.appConfiguration.collapsed);
    }
  }

  toggleSidebar() {
    if (!this.isMobile) {
      this.config.appConfiguration.collapsed = !this.config.appConfiguration.collapsed;
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-mode', this.isDarkTheme);
  }

  // Add this method for smooth scrolling
  scrollToSection(event: Event, href: string) {
    event.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (this.isMobile) this.isMenuOpen = false;
    }
  }
}