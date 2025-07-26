import { Component, Input, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() config: any;
  isSidebarCollapsed = false;
  isDarkTheme = false;
  isMobileOpen = false;
  isMobile = false;
  currentSection = '';

  menuItems = [
    { label: 'Home', href: '#home', icon: 'home' },
    { label: 'About', href: '#about', icon: 'person' },
    { label: 'Projects', href: '#projects', icon: 'work' },
    { label: 'Contact', href: '#contact', icon: 'mail' },
  ];

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.isMobile) {
      this.updateCurrentSection();
    }
  }

  ngOnInit() {
    this.checkMobile();
    this.updateCurrentSection();
    window.addEventListener('resize', this.checkMobile.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkMobile.bind(this));
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 900;
    if (!this.isMobile) {
      this.isMobileOpen = false;
    }
    this.config.navigation.isMobile = this.isMobile;
    console.log('Is mobile:', this.isMobile);
  }

  toggleSidebarCollapse() {
    this.config.navigation.collapsed = !this.config.navigation.collapsed;
    console.log('Sidebar collapsed:', this.config.navigation.collapsed);
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-mode', this.isDarkTheme);
  }

  scrollToSection(event: Event, href: string) {
    event.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleMobile() {
    this.isMobileOpen = !this.isMobileOpen;
  }

  toggleMobileMenu() {
    this.isMobileOpen = !this.isMobileOpen;
  }

  onMobileItemClick(event: Event, item: any) {
    event.preventDefault();
    this.scrollToSection(event, item.href);
    this.currentSection = item.label;
    this.isMobileOpen = false;
  }

  private updateCurrentSection() {
    // Get all sections
    const sections = this.menuItems.map(item => ({
      id: item.href.replace('#', ''),
      label: item.label
    }));

    // Find the current section based on scroll position
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          this.currentSection = section.label;
          break;
        }
      }
    }
  }
}
