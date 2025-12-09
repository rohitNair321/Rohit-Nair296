import { CommonModule } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { finalize } from 'rxjs';
import { CommonApp } from 'src/app/core/services/common';

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
export class SettingsComponent extends CommonApp implements OnInit {
  profileForm!: FormGroup;
  avatarDataUrl: string | null = null;
  resumeFileName: string | null = null;

  constructor(public override injector: Injector, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(80)]],
      description: ['', [Validators.maxLength(600)]],
      email: ['', [Validators.required, Validators.email]],
      primaryPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{7,20}$/)]],
      secondaryPhone: [''],
      location: ['', Validators.maxLength(120)],
      website: ['', Validators.pattern(/https?:\/\/.+/i)],
      linkedin: [''],
      github: [''],
      openToWork: [false],
      skills: this.fb.array([], Validators.required),
      resume: [null, pdfFileValidator],
      avatar: [null],
      experiences: this.fb.array([])
    });

    // load persisted data if available (localStorage stub)
    const saved = localStorage.getItem('profileForm');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.profileForm.patchValue(parsed);
      if (parsed.avatarDataUrl) this.avatarDataUrl = parsed.avatarDataUrl;
      if (parsed.resumeFileName) this.resumeFileName = parsed.resumeFileName;
      (parsed.skills || []).forEach((s: string) => this.addSkill(s));
      (parsed.experiences || []).forEach((exp: any) => this.addExperience(exp));
    }
  }
  // Skills helpers
  get skills(): FormArray { return this.profileForm.get('skills') as FormArray; }
  addSkill(value = '') {
    this.skills.push(this.fb.control(value, Validators.maxLength(50)));
  }
  removeSkill(i: number) { this.skills.removeAt(i); }

  // Experiences helpers
  get experiences(): FormArray { 
    return this.profileForm.get('experiences') as FormArray; 
  }
  
  get experienceForms(): FormGroup[] {
    return this.experiences.controls as FormGroup[];
  }
  createExperience(data?: any) {
    return this.fb.group({
      role: [data?.role || '', Validators.required],
      company: [data?.company || '', Validators.required],
      startDate: [data?.startDate || '', Validators.required],
      endDate: [data?.endDate || ''],
      present: [!!data?.present],
      description: [data?.description || '', Validators.maxLength(1000)]
    });
  }
  addExperience(data?: any) { this.experiences.push(this.createExperience(data)); }
  removeExperience(i: number) { this.experiences.removeAt(i); }

  onAvatarChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarDataUrl = reader.result as string;
      this.profileForm.patchValue({ avatar: f });
    };
    reader.readAsDataURL(f);
  }

  onResumeChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      this.profileForm.get('resume')?.setErrors({ fileType: true });
      return;
    }
    this.resumeFileName = f.name;
    this.profileForm.patchValue({ resume: f });
  }

  removeAvatar() {
    this.avatarDataUrl = null;
    this.profileForm.patchValue({ avatar: null });
  }

  removeResume() {
    this.resumeFileName = null;
    this.profileForm.patchValue({ resume: null });
  }

  saveSettings() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    // Build payload — use FormData if uploading files
    const formData = new FormData();
    formData.append('payload', JSON.stringify({
      ...this.profileForm.value,
      // remove file objects from JSON payload, they'll be attached below
      resume: undefined,
      avatar: undefined
    }));

    const resumeFile = this.profileForm.get('resume')?.value as File | null;
    if (resumeFile) formData.append('resume', resumeFile, resumeFile.name);
    const avatarFile = this.profileForm.get('avatar')?.value as File | null;
    if (avatarFile) formData.append('avatar', avatarFile, avatarFile.name);

    // Example: send to API via HttpClient (not included here)
    // this.http.post('/api/profile', formData).subscribe(...)

    // Persist locally as fallback
    const persist = {
      ...this.profileForm.value,
      avatarDataUrl: this.avatarDataUrl,
      resumeFileName: this.resumeFileName,
      skills: this.skills.value,
      experiences: this.experiences.value
    };
    localStorage.setItem('profileForm', JSON.stringify(persist));

    // Feedback to user
    alert('Settings saved locally (and prepared for upload).');
  }

  resetDefaults() {
    this.profileForm.reset();
    while (this.skills.length) this.skills.removeAt(0);
    while (this.experiences.length) this.experiences.removeAt(0);
    this.avatarDataUrl = null;
    this.resumeFileName = null;
    localStorage.removeItem('profileForm');
  }
}


function pdfFileValidator(control: AbstractControl) {
  const file = control.value as File | null;
  if (!file) return null;
  const ok = file.type === 'application/pdf' || (file.name && file.name.toLowerCase().endsWith('.pdf'));
  return ok ? null : { fileType: true };
}