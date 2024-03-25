import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePopupService {

  private isVisibleSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  showPopup(): void {
    this.isVisibleSubject.next(true);
  }

  hidePopup(): void {
    this.isVisibleSubject.next(false);
  }

  isVisible$(): Observable<boolean> {
    return this.isVisibleSubject.asObservable();
  }

}
