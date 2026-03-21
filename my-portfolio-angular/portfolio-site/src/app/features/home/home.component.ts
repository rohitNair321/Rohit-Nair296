import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, Renderer2, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as e from 'cors';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule  } from 'primeng/textarea';
import { Subject, Subscription, switchMap, take, timer } from 'rxjs';
import { CommonApp } from 'src/app/core/services/common';
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
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    TextareaModule,
    DialogModule,
    TagModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent extends CommonApp implements OnInit, OnDestroy {

  homeData: any;
  contactForm: FormGroup;
  projectList: any[] = [];
  experienceYears = 5;
  totalProjects = 20;
  showProjectDialog: boolean = false;
  send: boolean = false;
  selectedProject: any = null;
  showContactDialog = false;
  profileData = this.appService.profile;
  pullNotification!: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    public override injector: Injector,
    private fb: FormBuilder,
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
    } else {
      this.getMyProfile();
      if (this.appService.role() === 'ADMIN') {
        this.getNotifications();
      }
    }
  }

  onSubmitContact() {
    this.loading.show('Sending your message...');
    const formData = this.contactForm.value;
    this.appService.sendContactMessage(formData).pipe(take(1)).subscribe({
      next: (response) => {
        this.loading.hide();
        this.contactForm.reset();
        this.alertService.showAlert(`Message sent successfully! ${this.profileData()?.full_name} will be notified about it. `, 'success');
      },
      error: (err) => {
        this.loading.hide();
        console.error('Submission failed', err);
        this.alertService.showAlert('Failed to send message. Please try again later.', 'error');
      }
    });
  }

  get firstName() { return this.contactForm.get('firstName'); }
  get lastName() { return this.contactForm.get('lastName'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }

  getMyProfile(): void {
    this.loading.show('Loading profile...');
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

  getNotifications(): void {
    this.appService.getNotifications().subscribe({
      next: (notifications) => {
        if (notifications.unreadCount > 0) {
          this.alertService.showAlert(`You have ${notifications.unreadCount} notifications`, 'info');
        }
      },
      error: (err) => {
        this.alertService.showAlert(`Failed to fetch notifications. Please try again later.`, 'error');
        console.error('Failed to fetch notifications', err);
      }
    });
  }

  goToProjects(){
    this.alertService.showAlert(`This project page is under development, will be in functional soon!!`, 'info');
  }

  openProject(project: any) {
    this.selectedProject = project;
    this.showProjectDialog = true;
  }

  aboutMe(){
    this.router.navigate(['app/about']);
    // this.alertService.showAlert(`This about me page is under development, will be in functional soon!!`, 'info');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
