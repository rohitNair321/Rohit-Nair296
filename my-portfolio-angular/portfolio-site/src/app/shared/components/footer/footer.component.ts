import { CommonModule } from '@angular/common';
import { Component, computed, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    RadioButtonModule,
    ButtonModule,
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent extends CommonApp {

  profileInfo: any;
  menuItems = [
    { label: 'Home', href: '#home', icon: 'home' },
    { label: 'About', href: '#about', icon: 'person' },
    { label: 'Projects', href: '#projects', icon: 'work' },
    { label: 'Contact', href: '#contact', icon: 'mail' },
  ];
  constructor(public override injector: Injector,) {
    super(injector);
  }

  profileData = computed(() => {
    return (
      this.appService.profile()
    );
  });


  ngOnInit() {
    this.profileInfo = this.profileData();
  }

}
