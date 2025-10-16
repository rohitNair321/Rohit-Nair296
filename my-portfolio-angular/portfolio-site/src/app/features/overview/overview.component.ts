import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
  @Input() profile?: UserProfile;
  @Input() loading = false;

  // Hook up to parent container / services
  @Output() onEdit = new EventEmitter<void>();
  @Output() onEditContact = new EventEmitter<void>();
  @Output() onChangePhoto = new EventEmitter<void>();
  @Output() onOpenSettings = new EventEmitter<void>();
  @Output() onOpenSecurity = new EventEmitter<void>();
  @Output() onViewAllActivity = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();

  initials = 'U';

  ngOnInit(): void {
    // Fallback mock for design/dev; remove when wiring real data.
    if (!this.profile) {
      this.profile = {
        name: 'Rohit Nair',
        username: 'rohitnair',
        email: 'rohit@example.com',
        verified: true,
        about: 'Angular developer focused on clean UI, accessibility, and scalable frontends.',
        location: 'Pune, India',
        company: 'Self-employed',
        website: 'rohitnair321.github.io/dev-content-hub',
        resumeUrl: 'assets/Rohit.Nair.pdf',
        skills: ['Angular', 'TypeScript', 'JavaScript', 'Primeng', 'Custom-CSS'],
        stats: { projects: 12, posts: 34, followers: 287, following: 142 },
        security: {
          twoFactorEnabled: true,
          lastLogin: new Date(),
          passwordStrength: 'Strong'
        },
        activity: [
          { title: 'Pushed changes to Portfolio UI', when: new Date() },
          { title: 'Published Medium article on Reactive Forms', when: new Date(Date.now() - 86400000) },
          { title: 'Replied to a LinkedIn comment', when: new Date(Date.now() - 2 * 86400000) }
        ],
        joinedOn: new Date('2023-05-01')
      };
    }

    this.initials = this.computeInitials(this.profile?.name);
  }

  private computeInitials(name?: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0]?.toUpperCase() || '')
      .join('') || 'U';
  }

  normalizeUrl(url?: string): string {
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }

  skillsClass(skill: string): string {
    // Align chips with your existing badge classes where possible
    const map: Record<string, string> = {
      Angular: 'Angular',
      'Angular 17': 'Angular17',
      TypeScript: 'TypeScript',
      JavaScript: 'JavaScript',
      Primeng: 'Primeng',
      'Custom CSS': 'Custom-CSS'
    };
    return map[skill] || skill.replace(/\s+/g, '-');
  }
}



export interface UserSecuritySummary {
  twoFactorEnabled?: boolean;
  lastLogin?: string | Date;
  passwordStrength?: 'Weak' | 'Fair' | 'Good' | 'Strong' | string;
}

export interface UserActivityItem {
  title: string;
  when: string | Date;
}

export interface UserStats {
  projects?: number;
  posts?: number;
  followers?: number;
  following?: number;
}

export interface UserProfile {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  verified?: boolean;

  about?: string;
  location?: string;
  company?: string;
  website?: string;
  resumeUrl?: string;

  skills?: string[];

  stats?: UserStats;
  security?: UserSecuritySummary;
  activity?: UserActivityItem[];

  joinedOn?: string | Date;
}