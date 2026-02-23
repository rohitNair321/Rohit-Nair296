import { CommonModule } from '@angular/common';
import { Component, HostListener, Injector, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { Subject } from 'rxjs';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css'],
})
export class AboutMeComponent extends CommonApp implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  showContactDialog: boolean = false;
  profileData = this.appService.profile;
  constructor(public override injector: Injector) {
    super(injector);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    const progressFill = document.querySelector('.progress-fill') as HTMLElement;
    const progressPercentage = document.querySelector('.progress-percentage') as HTMLElement;

    if (progressFill && progressPercentage) {
      progressFill.style.width = scrolled + '%';
      progressPercentage.textContent = Math.round(scrolled) + '%';
    }
  }

  ngOnInit() {
  }

  // In your component
  openContactDialog() {
    this.showContactDialog = true;
  }

  closeContactDialog() {
    this.showContactDialog = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

