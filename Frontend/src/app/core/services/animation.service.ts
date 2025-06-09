import { Injectable } from '@angular/core';
import { AnimationBuilder, style, animate } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  constructor(private builder: AnimationBuilder) {}

  createFadeInAnimation(element: HTMLElement, duration: number = 800) {
    const myAnimation = this.builder.build([
      style({ opacity: 0, transform: 'translateY(20px)' }),
      animate(`${duration}ms ease-out`, style({ opacity: 1, transform: 'translateY(0)' }))
    ]);
    const player = myAnimation.create(element);
    player.play();
  }

  createSlideInAnimation(element: HTMLElement, direction: 'left' | 'right', duration: number = 800) {
    const myAnimation = this.builder.build([
      style({
        opacity: 0,
        transform: `translateX(${direction === 'left' ? '-100px' : '100px'})`
      }),
      animate(`${duration}ms ease-out`, style({ opacity: 1, transform: 'translateX(0)' }))
    ]);
    const player = myAnimation.create(element);
    player.play();
  }
}