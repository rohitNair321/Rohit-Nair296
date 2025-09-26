import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AboutMeComponent {

  skills = [
    'Angular', 'Tailwind CSS', 'Node.js', 'Supabase', 
    'Firebase', 'MongoDB', 'Gemini AI', 'LLaMA (Groq)'
  ];

  focusAreas = [
    'Building Gemini and LLaMA AI switcher',
    'Exploring Supabase Edge Functions & Auth',
    'Automating features with AI agents',
    'Writing short-form content on Medium'
  ];

  constructor() {
    // Initialization logic if needed
  }

  ngOnInit() {
    // Fetch any data or perform actions on component initialization
  }
}
