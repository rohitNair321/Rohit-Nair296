import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ThemeService } from '../../theme.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-new-year-animation',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './new-year-animation.component.html',
  styleUrl: './new-year-animation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewYearAnimationComponent {
  private themeService = inject(ThemeService);

  // Checks for "newyear" in the name or ID
  isNewYear = computed(() => 
    this.themeService.isNewYearTheme() // Ensure you add this helper to ThemeService
  );

  // confetti = Array.from({ length: 60 });
  fireworks = Array.from({ length: 5 });

  showAnimations = signal(true);
  toggleAnimations() {
    this.showAnimations.update(v => !v);
  }

  confetti = Array.from({ length: 50 }).map(() => ({
    x: Math.random() * 100,
    delay: Math.random() * 5,
    color: ['#fbbf24', '#8b5cf6', '#f8fafc'][Math.floor(Math.random() * 3)]
  }));
}