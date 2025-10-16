import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Input, OnInit, HostListener, Injector, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    RadioButtonModule,
    ButtonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() config: any;
  isSidebarCollapsed = false;
  isRightSideSettingOpen = false;
  isDarkTheme = false;
  isMobileOpen = false;
  isMobile = false;
  currentSection = '';
  navigationType: string = '';
  selectedTheme: string = 'theme-1';
  availableThemes = [
    { name: 'Theme 1 (Peachy Warm)', label: 'Peachy Warm', class: 'theme-1', color: '#9B7E6B', selected: false },
    { name: 'Theme 2 (Blue Modern)', label: 'Blue Modern', class: 'theme-2', color: '#7B61FF', selected: false },
    { name: 'Theme 3 (Indigo Teal)', label: 'Indigo Teal', class: 'theme-3', color: '#3F8A8F', selected: false },
    { name: 'Theme 4 (Plum Seafoam)', label: 'Plum Seafoam', class: 'theme-4', color: '#4FA49C', selected: false },
  ];
  menuItems = [
    { label: 'Home', href: '#home', icon: 'home' },
    { label: 'About', href: '#about', icon: 'person' },
    { label: 'Projects', href: '#projects', icon: 'work' },
    { label: 'Contact', href: '#contact', icon: 'mail' },
  ];

  constructor(@Inject(DOCUMENT) private document: Document) {

  }


  ngOnInit() {
    this.checkMobile();
    this.updateCurrentSection();
    window.addEventListener('resize', this.checkMobile.bind(this));
    this.navigationType = this.config?.appConfiguration?.type === 'sidebar'? 'sidebar' : 'navbar';
    this.applyTheme(this.config?.theme?.name);
    this.availableThemes.forEach(theme => {
      theme.selected = theme.class === this.config?.theme?.name;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.isMobile) {
      this.updateCurrentSection();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkMobile.bind(this));
  }

  onThemeChange(event: any) {
    this.config.theme.name = event.class;
    this.applyTheme(this.config.theme.name);
    this.availableThemes.forEach(theme => {
      theme.selected = theme.class === event.class?true:false;
    });
  }

  applyTheme(themeClass: string) {
    const body = this.document.body;
    this.availableThemes.forEach(theme => {
      body.classList.remove(theme.class);
    });
    body.classList.add(themeClass);
    // Apply new theme class
    // body.classList.add(themeClass);
    // this.selectedTheme = themeClass;

    // Apply dark mode if active
    body.classList.toggle('dark-mode', this.isDarkTheme);
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 900;
    if (!this.isMobile) {
      this.isMobileOpen = false;
    }
    this.config.appConfiguration.isMobile = this.isMobile;
  }

  toggleSidebarCollapse() {
    this.config.appConfiguration.collapsed = !this.config.appConfiguration.collapsed;
    console.log('Sidebar collapsed:', this.config.appConfiguration.collapsed);
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

  toggleSettingSideBar(){
    this.isRightSideSettingOpen = !this.isRightSideSettingOpen;
  }

  onNavigationTypeChange(navigationType: any) {
    // Update your config or emit an event to switch navigation type
    navigationType
    this.config.appConfiguration.type = this.navigationType;
    this.isRightSideSettingOpen = false;
  }
}
