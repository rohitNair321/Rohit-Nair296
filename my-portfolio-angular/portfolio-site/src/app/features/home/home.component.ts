import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Injector, OnInit, Renderer2, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AppService } from 'src/app/auth/services/app.service';
import { CommonApp } from 'src/app/core/services/common';
import { InViewDirective } from 'src/app/shared/directives/in-view.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InViewDirective
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CommonApp implements OnInit, AfterViewInit {

  cardWidth = 320; // px, match your CSS .portfolio-card max-width
  cardGap = 32;    // px, match your CSS .portfolio-slider-inner gap (2rem = 32px)
  projectsPerView = 3; // or calculate based on screen size

  currentProjectIndex = 0;
  hoveredProject: any = null;
  homeData: any;

  contactForm: FormGroup;
  sending = false;
  sent = false;
  

  constructor(
    public override injector: Injector,
    private el: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
  ) {
    super(injector);
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.maxLength(60)]],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() {
    this.runAnimations();
  }

  runAnimations() {
    const animatedEls = this.el.nativeElement.querySelectorAll(
      '.animate-fade-in-left, .animate-fade-in-right, .animate-fade-in-up'
    );
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    animatedEls.forEach((el: Element) => observer.observe(el));
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  visibleProjects() {
    // Use homeData.projects instead of this.projects
    return this.homeData?.projects
      ? this.homeData.projects.slice(this.currentProjectIndex, this.currentProjectIndex + this.projectsPerView)
      : [];
  }

  slideLeft() {
    if (this.currentProjectIndex > 0) {
      this.currentProjectIndex--;
    }
  }
  slideRight() {
    if (
      this.homeData?.projects &&
      this.currentProjectIndex + this.projectsPerView < this.homeData.projects.length
    ) {
      this.currentProjectIndex++;
    }
  }

  onSubmitContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.sending = true;
    this.sent = false;

    // Simulate sending email (replace with real API call)
    setTimeout(() => {
      this.sending = false;
      this.sent = true;
      this.contactForm.reset();
      setTimeout(() => this.sent = false, 3000);
    }, 2000);
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }


  getData() {
    this.loading.show();
    this.portfolioServices.getProfile().subscribe({
      next: res => {
        console.log('Profile Data:', res);
        this.homeData = res.home; // Wait for DOM update
        this.loading.hide();
      },
      error: err => {
        console.error('Error fetching profile data:', err);
        this.loading.hide();
      }
    });
    // this.portfolioServices.listProjects().subscribe({
    //   next: res => {
    //     console.log('Project list:', res);
    //     // this.loading.hide();
    //   },
    //   error: err => {
    //     console.error('Error fetching project list:', err);
    //     this.loading.hide();
    //   }
    // });
  }

  techClass(tech: string): string {
    return tech.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

}
