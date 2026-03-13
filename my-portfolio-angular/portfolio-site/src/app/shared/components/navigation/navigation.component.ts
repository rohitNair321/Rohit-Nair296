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
import { RouterModule } from '@angular/router';
import { MenuItem } from 'src/app/core/config/menuItem.config';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

/** Pixel breakpoint that matches app-shell and main-layout. */
const MOBILE_BREAKPOINT = 900;

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
    RouterModule,
    OverlayBadgeModule
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
  isMobileOpen: boolean = false;
  currentSection!: string;

  // @HostBinding('class.sidebar-left') get sidebarLeft() {
  //   return this.config?.appConfiguration?.type === 'sidebar' && this.config?.appConfiguration?.sidebarPosition === 'left';
  // }

  // @HostBinding('class.sidebar-right') get sidebarRight() {
  //   return this.config?.appConfiguration?.type === 'sidebar' && this.config?.appConfiguration?.sidebarPosition === 'right';
  // }

  // menuItems = [
  //   { label: 'Home', href: '#home', icon: 'home' },
  //   { label: 'About', href: '#about', icon: 'person' },
  //   { label: 'Projects', href: '#projects', icon: 'work' },
  //   { label: 'Contact', href: '#contact', icon: 'mail' },
  // ];
  // ── Computed signals ─────────────────────────────────────────
  profileData = computed(() => this.appService.profile());
  notifications = computed(() => this.appService.notifications());
  private readonly _onResize = this._handleResize.bind(this);
  constructor(public override injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this._handleResize();                            // set initial state
    window.addEventListener('resize', this._onResize);
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

  toggleMenu(): void {
    if (this.config?.appConfiguration?.type === 'navbar') {
      this.isMenuOpen = !this.isMenuOpen;
    } else if (this.config?.appConfiguration?.type === 'sidebar') {
      const next = !this.config.appConfiguration.collapsed;
      this.config.appConfiguration.collapsed = next;
      this.isSidebarCollapsedChange.emit(next);
    }
  }

  toggleSidebar() {
    if (!this.isMobile) {
      this.config.appConfiguration.collapsed = !this.config.appConfiguration.collapsed;
    }
  }

  logout() {
    this.themeService.isDark.set(false);
    this.themeService.currentThemeId.set('');
    this.authService.logout();
  }

  toggleTheme() {
    this.themeToggle();
  }

  onMobileItemClick(event: Event, item: MenuItem): void {
    // Sub-menu items: toggle expansion, keep dropdown open
    if (item.subMenu?.length) {
      item.expanded = !item.expanded;
      return;
    }
    // Anchor-scroll items
    if (item.href) {
      event.preventDefault();
      this.scrollToSection(event, item.href);
    }
    this.isMenuOpen = false;
  }


  onMenuItemClick(item: MenuItem) {
    if (item.actions) {
      item.actions(this.profileData()?.resume_url);
    }
  }

  private _handleResize(): void {
    const nowMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    if (this.isMobile === nowMobile) { return; }  // no change — skip

    this.isMobile = nowMobile;
    this.config.appConfiguration.isMobile = nowMobile;

    // Close mobile dropdown when growing above breakpoint
    if (!nowMobile) {
      this.isMenuOpen = false;
    }
  }

}