import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {
  
}
