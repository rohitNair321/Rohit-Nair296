import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnDestroy,
  inject,
  ViewContainerRef,
  TemplateRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Router, Event as RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

interface MenuItem {
  icon?: string;
  label: string;
  route?: string;
  action?: () => void;
}

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent implements OnDestroy {
  private overlay = inject(Overlay);
  private router = inject(Router);

  @ViewChild('avatarBtn', { static: true }) avatarBtn!: ElementRef<HTMLElement>;
  @ViewChild('menuPortal') menuPortal!: TemplateRef<any>;

  overlayRef?: OverlayRef;
  private routeSub?: Subscription;

  constructor(private viewContainerRef: ViewContainerRef) { }

  user = {
    name: 'Rohit Nair',
    email: 'rohit@example.com',
    avatarUrl: '', // fallback to initials if not present
  };

  readonly menu: MenuItem[] = [
    { icon: 'account_circle', label: 'My Profile', route: '/profile' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
    { icon: 'help', label: 'Help & Support', route: '/help' },
  ];

  toggle(): void {
    if (this.overlayRef?.hasAttached()) {
      this.close();
      return;
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.avatarBtn)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -8 },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'profile-menu-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());

    // Close menu on route change
    this.routeSub = this.router.events.subscribe(() => this.close());

    this.overlayRef.attach(new TemplatePortal(this.menuPortal, this.viewContainerRef));

    // Focus first focusable element for accessibility
    setTimeout(() => {
      const firstFocusable = this.overlayRef!.overlayElement.querySelector(
        '[tabindex],button,a,input,select,textarea,[href]'
      ) as HTMLElement | null;
      firstFocusable?.focus();
    });
  }

  navigate(item: MenuItem): void {
    if (item.route) {
      this.router.navigateByUrl(item.route);
    } else if (item.action) {
      item.action();
    }
    this.close();
  }

  logout(): void {
    // TODO: Integrate with your auth service
    // this.auth.logout();
    this.router.navigateByUrl('/auth/login');
    this.close();
  }

  close(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
      this.routeSub = undefined;
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.close();
      this.avatarBtn.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
