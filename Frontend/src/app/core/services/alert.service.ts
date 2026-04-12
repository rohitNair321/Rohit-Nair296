import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Injectable({ providedIn: 'root' })
export class AlertService {
  isOpen = signal(false);
  message = signal('');
  type = signal<AlertType>('info');

  showAlert(message: string, type: AlertType = 'info') {
    this.message.set(message);
    this.type.set(type);
    this.isOpen.set(true);

    // Auto-hide after 5 seconds
    setTimeout(() => this.isOpen.set(false), 5000);
  }

  close() {
    this.isOpen.set(false);
  }
}