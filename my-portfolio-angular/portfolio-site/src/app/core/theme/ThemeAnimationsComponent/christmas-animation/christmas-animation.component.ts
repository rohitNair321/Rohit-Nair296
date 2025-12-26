import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ThemeService } from '../../theme.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-christmas-animation',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './christmas-animation.component.html',
  styleUrl: './christmas-animation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChristmasAnimationComponent {
  private themeService = inject(ThemeService);

  currentTheme = computed(() => this.themeService.currentTheme());
  sparkles = Array.from({ length: 50 });
  winds = Array.from({ length: 6 });

  constructor() {
    console.log('Current theme:', this.themeService.currentTheme());

  }

  isChristmas = computed(() =>
    this.currentTheme()?.includes('christmas')
  );
  // Toggle for user preference
  showAnimations = signal(true);
  toggleAnimations() {
    this.showAnimations.update(v => !v);
  }
}
