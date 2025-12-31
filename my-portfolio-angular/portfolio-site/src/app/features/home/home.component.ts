import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Injector, OnInit, Renderer2, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as e from 'cors';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { take } from 'rxjs';
import { AppService } from 'src/app/core/services/app.service';
import { CommonApp } from 'src/app/core/services/common';
import { ProjectDetailDialogComponent } from 'src/app/shared/components/dialogs/project-detail-dialog.component';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

interface Hero {
  name: string;
  description: string;
  skills: string[];
  profileImage?: string;
  resume?: string; // URL or blob URL
}
interface AboutTeaser { title: string; description: string; photo?: string; resume?: string; }
interface ContactInfo { headingText?: string; subHeadingText?: string; email?: string; phone?: string; address?: string; }
interface HomeData { hero: Hero; aboutTeaser?: AboutTeaser; contact?: ContactInfo; }

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
    DialogModule,
    TagModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.animate-section', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(150, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent extends CommonApp implements OnInit {

  homeData: any;

  contactForm: FormGroup;
  sending = false;
  sent = false;
  projectList: any[] = [];
  experienceYears = 5;
  totalProjects = 20;
  // Dialog State
  showProjectDialog = false;
  selectedProject: any = null;

  showContactDialog = false;
  // private dialog = inject(Dialog);
  profileData = this.appService.profile;

  constructor(
    public override injector: Injector,
    private el: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {
    super(injector);
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    if (this.profileData()) {
      this.homeData = this.profileData();
      this.applyThemeFromProfile(this.profileData());
    } else {
      this.getMyProfile();
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

  get firstName() { return this.contactForm.get('firstName'); }
  get lastName() { return this.contactForm.get('lastName'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }

  getMyProfile(): void {
    this.loading.show();
    this.appService.getProfile().pipe(take(1)).subscribe({
      next: (profile) => {
        this.homeData = profile;
        this.applyThemeFromProfile(this.profileData());
        this.loading.hide();
      },
      error: (e) => {
        console.error(e.error.message);
        this.loading.hide();
      }
    });
  }

  openProject(project: any) {
    this.selectedProject = project;
    this.showProjectDialog = true;
  }

}
