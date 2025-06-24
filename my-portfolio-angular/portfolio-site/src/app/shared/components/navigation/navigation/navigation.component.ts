import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';// For Font Awesome 5.x

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
  isSidebarCollapsed = false;

  menuItems = [
    { label: 'Home', href: '#home', icon: 'home' },
    { label: 'About', href: '#about', icon: 'person' },
    { label: 'Projects', href: '#projects', icon: 'work' },
    { label: 'Contact', href: '#contact', icon: 'mail' },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    console.log(this.config);
    this.setupResponsiveBehavior();
    this.initializeTheme();
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile.bind(this));
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
    this.isDarkTheme = this.config.navigation.theme == 'dark'?true:false;
    this.isDarkTheme = document.body.classList.toggle('dark-mode',this.isDarkTheme);
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 900;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-mode', this.isDarkTheme);
  }

  toggleSidebarCollapse() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
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