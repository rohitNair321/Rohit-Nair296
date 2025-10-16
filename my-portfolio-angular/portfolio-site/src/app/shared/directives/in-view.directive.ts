import { Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appInView]',
  standalone: true
})
export class InViewDirective implements OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {
    if (typeof window === 'undefined') return; // SSR safety

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add('in-view');
            this.observer?.unobserve(this.el.nativeElement); // fire once
          }
        }
      },
      { root: null, threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
