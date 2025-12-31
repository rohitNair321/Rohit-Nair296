import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, HostListener, Injector, Inject, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { defaultConfig, LayoutConfig } from 'src/app/core/config/layout.config';
import { CommonApp } from 'src/app/core/services/common';

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
export class SidebarComponent extends CommonApp implements OnInit {
  @Input() config: LayoutConfig = defaultConfig;
  isSidebarCollapsed = false;
  isRightSideSettingOpen = false;
  isMobileOpen = false;
  isMobile = false;
  currentSection = '';
  navigationType: any = '';
  selectedTheme: string = this.config.theme.name;
  profileSignal = computed(() => {
    return (
      this.appService.profile()
    );
  });
  availableThemes = computed(() => {
    const profile = this.profileSignal();
    const themes = this.normalizeThemesResponse(profile?.themes || []);
    return themes;
  });

  menuItems = [
    { label: 'Home', href: '#home', icon: 'home' },
    { label: 'About', href: '#about', icon: 'person' },
    { label: 'Projects', href: '#projects', icon: 'work' },
    { label: 'Contact', href: '#contact', icon: 'mail' },
  ];

  constructor(public override injector: Injector) {
    super(injector);
  }


  ngOnInit() {
    this.checkMobile();
    this.updateCurrentSection();
    window.addEventListener('resize', this.checkMobile.bind(this));
    this.navigationType = this.config?.appConfiguration?.type === 'sidebar' ? 'sidebar' : 'navbar';
    // this.availableThemes = this.normalizeThemesResponse(this.profileSignal()?.themes);
  }

  @HostListener('window:scroll')
  onScroll() {
    if (this.isMobile) {
      this.updateCurrentSection();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkMobile.bind(this));
  }

  onThemeChange(event: any) {
    this.config.theme.name = event.name;
    this.themeService.setTheme(event.id);
    // this.availableThemes.forEach(theme => {
    //   theme.selected = theme.name === event.name ? true : false;
    // });
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

  // get isDarkTheme(): boolean {
  //   return this.themeService.isDarkTheme();
  // }

  toggleTheme() {
    this.themeToggle();
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

  toggleSettingSideBar() {
    this.isRightSideSettingOpen = !this.isRightSideSettingOpen;
  }

  onNavigationTypeChange(navigationType: any) {
    // Update your config or emit an event to switch navigation type
    navigationType
    this.config.appConfiguration.type = this.navigationType;
    this.isRightSideSettingOpen = false;
  }

  selectTheme(theme: any) {
    this.selectedTheme = theme.name;
    this.onThemeChange(theme);
  }
}
