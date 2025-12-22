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
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CommonApp implements OnInit {

  homeData: any;

  contactForm: FormGroup;
  sending = false;
  sent = false;
  projectList: any[] = [];
  experienceYears = 5;
  totalProjects = 20;

  showContactDialog = false;
  // private dialog = inject(Dialog);
  profileData = computed(() => {
    return (
      this.appService.profile()
    );
  });


  constructor(
    public override injector: Injector,
    private el: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private appService: AppService
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
    // this.getData();
    if (this.profileData()) {
      this.homeData = this.profileData();
    } else {
      this.getMyProfile();
    }
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // visibleProjects() {
  //   // Use homeData.projects instead of this.projects
  //   return this.homeData?.projects
  //     ? this.homeData.projects.slice(this.currentProjectIndex, this.currentProjectIndex + this.projectsPerView)
  //     : [];
  // }

  // slideLeft() {
  //   if (this.currentProjectIndex > 0) {
  //     this.currentProjectIndex--;
  //   }
  // }
  // slideRight() {
  //   if (
  //     this.homeData?.projects &&
  //     this.currentProjectIndex + this.projectsPerView < this.homeData.projects.length
  //   ) {
  //     this.currentProjectIndex++;
  //   }
  // }

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

  getMyProfile(): void {
    this.loading.show();
    this.appService.getProfile().pipe(take(1)).subscribe({
      next: (profile) => {
        this.homeData = profile;
        this.loading.hide();
      },
      error: (e) => {
        console.error(e.error.message);
        this.loading.hide();
      }
    });
  }

  getData() {
    this.loading.hide();
    // this.portfolioServices.getProfile().subscribe({
    //   next: res => {
    //     console.log('Profile Data:', res);
    //     this.homeData = res.home; // Wait for DOM update
    //     this.loading.hide();
    //   },
    //   error: err => {
    //     console.error('Error fetching profile data:', err);
    //     this.loading.hide();
    //   }
    // });
    // this.portfolioServices.listProjects().subscribe({
    //   next: res => {
    //     this.projectList = res;
    //     console.log('Project list:', res);
    //     this.loading.hide();
    //   },
    //   error: err => {
    //     console.error('Error fetching project list:', err);
    //     this.loading.hide();
    //   }
    // });
  }

  openProject(project: any) {
    // this.dialog.open(ProjectDetailDialogComponent, {
    //   data: project,
    //   backdropClass: ['cdk-overlay-dark-backdrop'], // nice dim on all themes
    //   panelClass: ['p-3'] // bootstrap spacing class on container
    //   // disableClose: true, // uncomment if you don't want backdrop click to close
    // });
  }


  techClass(tech: string): string {
    return tech.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

}
