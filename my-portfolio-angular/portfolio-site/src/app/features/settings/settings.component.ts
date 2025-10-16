import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

interface AppSettings {
  name: string;
  email: string;
  bio: string;
  avatarDataUrl?: string | null;
  theme: string;
  darkMode: boolean;
  reduceMotion: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  profileForm!: FormGroup;
  avatarDataUrl: string | null = null;
  availableThemes = ['theme-1', 'theme-2', 'theme-3', 'theme-4'];
  readonly storageKey = 'portfolioAppSettings';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadSettings();
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.maxLength(80)],
      email: ['', [Validators.email]],
      bio: [''],
      theme: ['theme-1'],
      darkMode: [false],
      reduceMotion: [false]
    });
  }

  loadSettings(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppSettings;
        this.avatarDataUrl = parsed.avatarDataUrl ?? null;
        this.profileForm.patchValue({
          name: parsed.name ?? '',
          email: parsed.email ?? '',
          bio: parsed.bio ?? '',
          theme: parsed.theme ?? 'theme-1',
          darkMode: !!parsed.darkMode,
          reduceMotion: !!parsed.reduceMotion
        });
        this.applyThemeClass();
        this.applyReduceMotion();
      } catch {
        // ignore
      }
    } else {
      this.applyThemeClass();
    }
  }

  saveSettings(): void {
    const payload: AppSettings = {
      ...this.profileForm.value,
      avatarDataUrl: this.avatarDataUrl
    };
    localStorage.setItem(this.storageKey, JSON.stringify(payload));
    this.applyThemeClass();
    this.applyReduceMotion();
    alert('Settings saved');
  }

  resetDefaults(): void {
    if (!confirm('Reset settings to defaults?')) { return; }
    this.avatarDataUrl = null;
    this.buildForm();
    localStorage.removeItem(this.storageKey);
    this.applyThemeClass();
    this.applyReduceMotion();
  }

  onAvatarChange(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    if (!input.files?.length) { return; }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarDataUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeAvatar(): void {
    this.avatarDataUrl = null;
  }

  applyThemeClass(): void {
    const root = document.documentElement;
    // remove existing theme-* classes
    Array.from(root.classList)
      .filter(c => c.startsWith('theme-'))
      .forEach(c => root.classList.remove(c));
    const theme = this.profileForm.get('theme')?.value || 'theme-1';
    root.classList.add(theme);

    // toggle dark-mode as a separate class (your variables use e.g. .theme-1.dark-mode)
    if (this.profileForm.get('darkMode')?.value) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  }

  applyReduceMotion(): void {
    if (this.profileForm.get('reduceMotion')?.value) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }
}
