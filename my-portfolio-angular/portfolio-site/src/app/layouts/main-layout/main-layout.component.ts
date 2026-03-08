import { CommonModule } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { defaultConfig, LayoutConfig } from 'src/app/core/config/layout.config';
import { THEME_NAME_MAP } from 'src/app/core/config/theme.config';
import { CommonApp } from 'src/app/core/services/common';
import { ThemeService } from 'src/app/core/theme/theme.service';
import { ChristmasAnimationComponent } from 'src/app/core/theme/ThemeAnimationsComponent/christmas-animation/christmas-animation.component';
import { NewYearAnimationComponent } from 'src/app/core/theme/ThemeAnimationsComponent/new-year-animation/new-year-animation.component';
import { ChatBotComponent } from 'src/app/shared/components/chat-bot/chat-bot.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavigationComponent } from 'src/app/shared/components/navigation/navigation.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, ChatBotComponent, NavigationComponent, SidebarComponent, FooterComponent, ChristmasAnimationComponent,
    NewYearAnimationComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent extends CommonApp {
  // config: LayoutConfig = defaultConfig;
  isSidebarCollapsed = true;

  constructor(public override injector: Injector) {
    super(injector);
    this.appConfig.theme.name = 'theme-6';
    this.appConfig.appConfiguration.type = 'sidebar';
    this.appConfig.appConfiguration.theme = 'light';
    this.appConfig.appConfiguration.sidebarPosition = 'right';
    this.appConfig.appConfiguration.logoLocationHeader = false;
    this.appConfig.appConfiguration.collapsed = true;
    this.appConfig.appConfiguration.showSidebarToggle = true;
    this.appConfig.appConfiguration.showAgentChat = false;
    this.appConfig.appConfiguration.showUserProfileView = this.appService.role() === 'ADMIN';
    this.appConfig.appConfiguration.showNotifications = this.appService.role() === 'ADMIN';
  }

  ngOnInit() {
    const layoutThemeName = this.appConfig?.theme?.name; // e.g. 'theme-5'

    const resolvedTheme =
      THEME_NAME_MAP[layoutThemeName] || 'tron';

    this.themeService.setTheme(resolvedTheme);
  }

  initSidebarMenu(sidebarEvent: any) {
    this.isSidebarCollapsed = sidebarEvent;
    this.appConfig.appConfiguration.collapsed = sidebarEvent;
  }
}