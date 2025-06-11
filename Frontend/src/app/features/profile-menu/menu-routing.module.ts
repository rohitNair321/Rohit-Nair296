import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { HelpSupportComponent } from './help-support/help-support.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { RecentActivityComponent } from './recent-activity/recent-activity.component';
import { AuthGardService } from 'src/app/core/services/auth-gard.service';

const routes: Routes = [
  { path: 'profile', component: UserProfileComponent,  canActivate: [AuthGardService] },
  { path: 'account-settings', component: AccountSettingsComponent,  canActivate: [AuthGardService] },
  { path: 'preferences', component: PreferencesComponent,  canActivate: [AuthGardService] },
  { path: 'recent-activity', component: RecentActivityComponent,  canActivate: [AuthGardService] },
  { path: 'help-support', component: HelpSupportComponent,  canActivate: [AuthGardService] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule { }
