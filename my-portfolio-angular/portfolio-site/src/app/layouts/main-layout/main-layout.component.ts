import {
  Component,
  HostListener,
  Injector,
  OnInit,
  OnDestroy,
  computed,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';
import { THEME_NAME_MAP } from 'src/app/core/config/theme.config';
import { CommonApp } from 'src/app/core/services/common';
import { ChristmasAnimationComponent } from 'src/app/core/theme/ThemeAnimationsComponent/christmas-animation/christmas-animation.component';
import { NewYearAnimationComponent } from 'src/app/core/theme/ThemeAnimationsComponent/new-year-animation/new-year-animation.component';
import { ChatBotComponent } from 'src/app/shared/components/chat-bot/chat-bot.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavigationComponent } from 'src/app/shared/components/navigation/navigation.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';

// ── Matches the CSS media-query breakpoint in main-layout.component.scss ──
const MOBILE_BREAKPOINT = 900;

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,           // required for [(ngModel)] on p-radioButton in the settings panel
    RadioButton,     // p-radioButton used in the settings panel template
    ChatBotComponent,
    NavigationComponent,
    SidebarComponent,      // always in DOM — CSS collapses it in navbar mode
    FooterComponent,
    ChristmasAnimationComponent,
    NewYearAnimationComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent extends CommonApp implements OnInit, OnDestroy {

  // ── Settings panel ────────────────────────────────────────────
  // Owned here (not in SidebarComponent) so the trigger + panel
  // are rendered at the root of main-layout's template, completely
  // outside the left sidebar's off-canvas DOM subtree and its
  // associated fixed-position stacking context.
  isSettingsPanelOpen = false;

  // ── Theme list for the settings panel theme picker ────────────
  // Signal-based so the grid auto-updates when the profile loads.
  availableThemes = computed(() =>
    this.normalizeThemesResponse(this.appService.profile()?.themes ?? [])
  );

  constructor(public override injector: Injector) {
    super(injector);

    // ── Default layout config ────────────────────────────────────
    // All values written here are the single source of truth —
    // child components (NavigationComponent, SidebarComponent) read
    // from this same appConfig object reference via their [config] input.
    this.appConfig.theme.name                           = 'theme-6';
    this.appConfig.appConfiguration.type                = 'sidebar';   // 'sidebar' | 'navbar'
    this.appConfig.appConfiguration.theme               = 'light';
    this.appConfig.appConfiguration.sidebarPosition     = 'left';      // always left
    this.appConfig.appConfiguration.logoLocationHeader  = false;       // brand in sidebar
    this.appConfig.appConfiguration.collapsed           = true;        // sidebar icon-only by default
    this.appConfig.appConfiguration.showSidebarToggle   = true;
    this.appConfig.appConfiguration.showAgentChat       = false;
    this.appConfig.appConfiguration.showUserProfileView = this.appService.role() === 'ADMIN';
    this.appConfig.appConfiguration.showNotifications   = this.appService.role() === 'ADMIN';
    this.appConfig.appConfiguration.isMobile            = this._isMobile();
  }

  // ── Lifecycle ────────────────────────────────────────────────

  ngOnInit(): void {
    // Apply the saved/default theme once the component initialises.
    // THEME_NAME_MAP converts the human-readable theme name ('theme-6')
    // to the ThemeService ID ('tron', 'ocean', etc.).
    const resolvedId = THEME_NAME_MAP[this.appConfig.theme.name ?? 'theme-5'] ?? 'tron';
    this.themeService.setTheme(resolvedId);
  }

  ngOnDestroy(): void {
    // Nothing to tear down currently — @HostListener cleans itself up.
    // Kept here so future subscriptions have a safe place to unsubscribe.
  }

  // ── Sidebar collapse ─────────────────────────────────────────
  // Called by both NavigationComponent (isSidebarCollapsedChange)
  // and SidebarComponent (collapseChange).
  // Also called by the mobile backdrop click to force-close.
  initSidebarMenu(collapsed: boolean): void {
    this.appConfig.appConfiguration.collapsed = collapsed;
  }

  // ── Settings panel ────────────────────────────────────────────

  /** Toggle the right-side preferences panel open / closed. */
  toggleSettingsPanel(): void {
    this.isSettingsPanelOpen = !this.isSettingsPanelOpen;
  }

  /**
   * Switch between 'sidebar' and 'navbar' layout modes.
   * Closes the settings panel on mobile after switching so the
   * newly-selected nav style is immediately visible.
   */
  onNavigationTypeChange(type: 'sidebar' | 'navbar'): void {
    this.appConfig.appConfiguration.type = type;

    // In sidebar mode, always start collapsed (icon-only) on switch
    if (type === 'sidebar') {
      this.appConfig.appConfiguration.collapsed = true;
    }

    if (this.appConfig.appConfiguration.isMobile) {
      this.isSettingsPanelOpen = false;
    }
  }

  /**
   * Move the brand logo between the topbar (logoLocationHeader=true)
   * and the sidebar header (logoLocationHeader=false).
   */
  onBrandLocationChange(inHeader: boolean): void {
    this.appConfig.appConfiguration.logoLocationHeader = inHeader;

    if (this.appConfig.appConfiguration.isMobile) {
      this.isSettingsPanelOpen = false;
    }
  }

  /**
   * Apply a theme from the settings panel theme picker.
   * Updates both the human-readable name (for display) and
   * the ThemeService ID (for CSS variable injection).
   */
  onThemeChange(theme: { id: string; name: string }): void {
    this.appConfig.theme.name = theme.name;
    this.themeService.setTheme(theme.id);
  }

  // ── Responsive resize ─────────────────────────────────────────
  @HostListener('window:resize')
  onResize(): void {
    const wasMobile = this.appConfig.appConfiguration.isMobile;
    const nowMobile = this._isMobile();

    if (wasMobile === nowMobile) { return; }   // no state change — skip

    this.appConfig.appConfiguration.isMobile = nowMobile;

    if (nowMobile) {
      // Shrinking to mobile: collapse sidebar so it doesn't overlay content
      this.appConfig.appConfiguration.collapsed = true;
    }
  }

  // ── Private helpers ───────────────────────────────────────────

  private _isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;
  }
}