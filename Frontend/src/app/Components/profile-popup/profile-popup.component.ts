import { Component, Input } from '@angular/core';

@Component({
  selector: 'profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.css']
})
export class ProfilePopupComponent {

  
  @Input() isVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // this.profilePopup.isVisible$().subscribe(result => {
    //   this.isVisible = result;
    // });
  }

  closePopup(): void {
    // this.profilePopup.hidePopup();
  }
}
