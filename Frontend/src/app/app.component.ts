import { CommonModule } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/components/ui/alert-dialog/alert.component';
import { SpinnerComponent } from './shared/components/ui/spinner-overlay/spinner.component';
import { CommonApp } from './core/services/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SpinnerComponent, AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends CommonApp {

  constructor(public override injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    
  }



}
