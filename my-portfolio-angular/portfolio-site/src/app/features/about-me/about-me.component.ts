import { ChangeDetectionStrategy, Component, HostListener, Injector, OnDestroy, OnInit, signal, effect } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
  ], // Removed CommonModule: @if, @for, and @hidden are built-in
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'], // Renamed to .scss
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent extends CommonApp implements OnInit {

  // v18 Signals for UI state
  showContactDialog = signal<boolean>(false);
  scrollPercentage = signal<number>(0);
  profileData = this.appService.profile; // Assuming this is already a signal from AppService

  constructor(public override injector: Injector) {
    super(injector);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update signal instead of direct DOM manipulation
    this.scrollPercentage.set(Math.round(scrolled));
  }

  ngOnInit() {}

  openContactDialog() {
    this.showContactDialog.set(true);
  }

  closeContactDialog() {
    this.showContactDialog.set(false);
  }
}