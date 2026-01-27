import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, HostListener, Injector, Inject, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BadgeModule } from 'primeng/badge';
import { defaultConfig, LayoutConfig } from 'src/app/core/config/layout.config';
import { CommonApp } from 'src/app/core/services/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'src/app/core/config/menuItem.config';

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
    BadgeModule,
    RouterModule,
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
  isMenuOpen = false;
  selectedTheme: string = this.config.theme.name;
  profileData = computed(() => {
    return (
      this.appService.profile()
    );
  });
  availableThemes = computed(() => {
    const profile = this.profileData();
    const themes = this.normalizeThemesResponse(profile?.themes || []);
    return themes;
  });

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
    this.navigationType = this.config?.appConfiguration?.type === 'sidebar' ? 'sidebar' : 'navbar';
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkMobile.bind(this));
  }

  onThemeChange(event: any) {
    this.config.theme.name = event.name;
    this.themeService.setTheme(event.id);
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
    this.isMenuOpen = !this.config.appConfiguration.collapsed;
    console.log('Sidebar collapsed:', this.config.appConfiguration.collapsed);
  }

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

  toggleSettingSideBar() {
    this.isRightSideSettingOpen = !this.isRightSideSettingOpen;
  }

  onNavigationTypeChange(navigationType: any) {
    navigationType
    this.config.appConfiguration.type = this.navigationType;
    this.isRightSideSettingOpen = false;
  }

  navigateToNotifications() {
    this.router.navigate(['app/notifications']);
  }

  selectTheme(theme: any) {
    this.selectedTheme = theme.name;
    this.onThemeChange(theme);
  }

  onMenuItemClick(item: MenuItem) {
    if (item.actions) {
      item.actions(this.profileData()?.resume_url);
    }
  }

  logout() {
    this.themeService.isDark.set(false);
    this.themeService.currentThemeId.set('');
    this.authService.logout();
  }
}
