import { Component, computed, Injector, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TimeAgoPipe } from '../../shared/pipes/time.pipe';
import { CommonApp } from 'src/app/core/services/common';
import { Subject, take } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, AccordionModule, ButtonModule, BadgeModule, TimeAgoPipe],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent extends CommonApp implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  notifications = computed(() => this.appService.notifications());
  openId: string | null = null;

  constructor(public override injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    // Load notifications if not yet in the signal
    if (!this.notifications()) {
      this.appService.getNotifications().pipe(take(1)).subscribe();
    }
  }

  toggleOpen(id: string): void {
    this.openId = this.openId === id ? null : id;
  }

  markAsRead(id: string, event: Event): void {
    event.stopPropagation();
    this.appService.markMessageAsRead(id).subscribe();
  }

  deleteMessage(id: string, event: Event): void {
    event.stopPropagation();
    this.appService.deleteMessage(id).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
