import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { HelpSupportComponent } from './help-support/help-support.component';
import { LogoutComponent } from './logout/logout.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { RecentActivityComponent } from './recent-activity/recent-activity.component';
import { UserProfileComponent } from './user-profile/user-profile.component';



@NgModule({
  declarations: [
    AccountSettingsComponent,
    HelpSupportComponent,
    LogoutComponent,
    PreferencesComponent,
    RecentActivityComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule
  ]
})
export class MenuModule { }
