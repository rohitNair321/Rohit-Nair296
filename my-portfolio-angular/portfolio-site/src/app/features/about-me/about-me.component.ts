import { CommonModule } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Subject } from 'rxjs';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css'],
})
export class AboutMeComponent extends CommonApp implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
config = ABOUT_ME_CONFIG;
  constructor(public override injector: Injector) {
    super(injector);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


export const ABOUT_ME_CONFIG = {
  profile: {
    name: 'Rohit',
    role: 'Web Developer · Angular Specialist',
    summary:
      'I build scalable, maintainable web interfaces with a focus on clean architecture and long-term growth.',
    photo: 'assets/profile.jpg'
  },

  sections: [
    {
      type: 'text',
      title: 'Experience',
      content:
        'Working as a Web Developer specializing in Angular, building reusable components, scalable UI systems, and collaborating with backend teams.'
    },
    {
      type: 'list',
      title: 'Education',
      items: [
        'Postgraduate studies in a technical discipline',
        'Undergraduate degree with strong analytical foundation'
      ]
    },
    {
      type: 'tags',
      title: 'Skills',
      items: [
        'Angular 15+',
        'TypeScript',
        'RxJS',
        'HTML',
        'CSS / SCSS',
        'REST APIs',
        'Git'
      ]
    },
    {
      type: 'list',
      title: 'Work Habits',
      items: [
        'Readable code over clever solutions',
        'Consistency beats intensity',
        'Refactor before complexity grows',
        'Think long-term'
      ]
    },
    {
      type: 'list',
      title: 'Currently Learning',
      highlight: true,
      items: [
        'Advanced Angular performance',
        'Node.js & NestJS',
        'AI integrations in web applications',
        'System design & scalability'
      ]
    }
  ]
};
