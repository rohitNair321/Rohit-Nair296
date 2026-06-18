import { CommonModule } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Observable, Subject, of, take, takeUntil } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CanComponentDeactivate } from 'src/app/core/app-gards/can-deactivate.guard';
import { Profile } from 'src/app/core/services/app.service';
import { CommonApp } from 'src/app/core/services/common';
import { ConfirmationService } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AnalyticsComponent } from 'src/app/shared/components/app-analytics/analytics-dashboard.component';
import { AiUsageDashboardComponent } from 'src/app/shared/components/ai-usage-dashboard/ai-usage-dashboard.component';
import { AboutMeEditorComponent } from 'src/app/shared/components/about-me-editor/about-me-editor.component';
import { MyLearningPostComponent } from 'src/app/shared/components/my-learning-post/my-learning-post.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    DialogModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ToggleButtonModule,
    AnalyticsComponent,
    AiUsageDashboardComponent,
    AboutMeEditorComponent,
    MyLearningPostComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends CommonApp implements OnInit, OnDestroy, CanComponentDeactivate {

  profileForm!: FormGroup;
  avatarDataUrl: string | null = null;
  resumeFileName: string | null = null;
  resumeUrl: string | null = null;
  profileSignal = this.appService.profile;
  selectedExperienceIndex: number | null = null;
  isAddingNewExperience = false;
  showExperienceDialog = false;
  showThemeBuilder = false;
  customThemeForm!: FormGroup;
  currentTheme = '';
  experienceDialogForm!: FormGroup;
  activeTab: 'light' | 'dark' = 'light';
  themesList: any[] = [];
  isEditingTheme = false;
  editingThemeId: string | null = null;
  private destroy$ = new Subject<void>();
  passwordForm!: FormGroup;
  isChangingPassword = false;
  showCurrentPassword = false;
  showNewPassword = false;
  lastPasswordUpdate: Date | null = null;
  activeSettingTab: 'profile' | 'aiChatMonitoring' | 'monitoring' | 'myLearningPosts' | 'aboutMeEditor' = 'profile';

  constructor(
    public override injector: Injector,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.buildForm();
    this.patchFromProfile(this.appService.profile());
    this.notifyUnread();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.profileForm.dirty) return true;

    const result$ = new Subject<boolean>();

    this.confirmationService.confirm({
      header: 'Unsaved Changes',
      message: 'You have pending changes. Would you like to save them before leaving, or discard them?',
      acceptLabel: 'Save & Leave',
      rejectLabel: 'Discard & Leave',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      closable: false,
      accept: () => { this.saveSettings(); result$.next(true); result$.complete(); },
      reject: () => { this.resetDefaults(); result$.next(true); result$.complete(); }
    });

    return result$.asObservable();
  }

  // ── Save / Load ──────────────────────────────────────────────

  saveSettings(): void {
    if (!this.profileForm.dirty) return;
    this.loading.show('Saving profile...');
    this.appService.updateProfile(this.buildProfilePayload()).pipe(take(1)).subscribe({
      next: updated => {
        this.patchFromProfile(updated);
        this.loading.hide();
        this.alertService.showAlert('Profile saved successfully!', 'success');
      },
      error: () => {
        this.loading.hide();
        this.alertService.showAlert('Failed to save. Please try again.', 'error');
      }
    });
  }

  resetDefaults(): void {
    this.patchFromProfile(this.appService.profile());
  }

  // ── Password ─────────────────────────────────────────────────

  updatePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.isChangingPassword = true;
    of(null).pipe(delay(600), take(1)).subscribe(() => {
      this.isChangingPassword = false;
      this.lastPasswordUpdate = new Date();
      this.alertService.showAlert('Password updated successfully!', 'success');
      this.passwordForm.patchValue({ currentPassword: '', newPassword: '' });
      this.passwordForm.markAsPristine();
      this.passwordForm.markAsUntouched();
      this.showCurrentPassword = false;
      this.showNewPassword = false;
    });
  }

  togglePasswordVisibility(field: 'current' | 'new'): void {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else {
      this.showNewPassword = !this.showNewPassword;
    }
  }

  getPasswordStrength(): number {
    const pw = this.passwordForm.get('newPassword')?.value || '';
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 4);
  }

  getPasswordStrengthText(): string {
    return ['VERY_WEAK', 'WEAK', 'FAIR', 'STRONG', 'VERY_STRONG'][this.getPasswordStrength()] ?? 'VERY_WEAK';
  }

  hasUpperCase(): boolean { return /[A-Z]/.test(this.passwordForm.get('newPassword')?.value || ''); }
  hasNumber(): boolean    { return /[0-9]/.test(this.passwordForm.get('newPassword')?.value || ''); }

  // ── Themes ───────────────────────────────────────────────────

  openThemeBuilder(): void {
    this.initThemeForm();
    this.isEditingTheme = false;
    this.editingThemeId = null;
    this.showThemeBuilder = true;
  }

  selectAndSaveTheme(theme: any): void {
    this.themeService.setTheme(theme.id);
    this.currentTheme = theme.name;
  }

  saveThemePreference(): void {
    this.loading.show('Applying theme...');
    this.appService.updateProfile({ currenttheme: this.currentTheme, themes: this.themesList })
      .pipe(take(1))
      .subscribe({
        next: () => { this.loading.hide(); this.alertService.showAlert('Theme preference saved!', 'success'); },
        error: () => this.loading.hide()
      });
  }

  editTheme(theme: any): void {
    this.isEditingTheme = true;
    this.editingThemeId = theme.id;
    this.showThemeBuilder = true;
    this.customThemeForm.patchValue({ theme_name: theme.name, tokens: theme.tokens, dark_tokens: theme.dark_tokens });
  }

  deleteTheme(themeId: string, event: Event): void {
    event.stopPropagation();
    this.loading.show('Deleting theme...');
    this.themesList = this.themesList.filter(t => t.id !== themeId);
    this.appService.updateProfile({ themes: this.themesList }).pipe(take(1)).subscribe({
      next: () => { this.loading.hide(); this.alertService.showAlert('Theme deleted.', 'info'); },
      error: () => this.loading.hide()
    });
  }

  saveCustomTheme(): void {
    if (this.customThemeForm.invalid) return;
    this.loading.show('Saving theme...');

    const v = this.customThemeForm.value;
    const newTheme = {
      id: this.isEditingTheme && this.editingThemeId ? this.editingThemeId : 'theme-' + Date.now(),
      name: v.theme_name,
      tokens: v.tokens,
      dark_tokens: v.dark_tokens
    };

    if (this.isEditingTheme) {
      const idx = this.themesList.findIndex(t => t.id === this.editingThemeId);
      if (idx > -1) this.themesList[idx] = newTheme; else this.themesList.push(newTheme);
    } else {
      this.themesList.push(newTheme);
    }

    this.themeService.registerThemes([newTheme]);
    this.showThemeBuilder = false;

    this.appService.updateProfile({ themes: this.themesList }).pipe(take(1)).subscribe({
      next: () => {
        this.loading.hide();
        this.alertService.showAlert(this.isEditingTheme ? 'Theme updated!' : 'Theme created!', 'success');
        this.isEditingTheme = false;
        this.editingThemeId = null;
      },
      error: () => this.loading.hide()
    });
  }

  // ── Experience dialog ─────────────────────────────────────────

  openExperienceDialog(exp?: any, index: number | null = null): void {
    this.selectedExperienceIndex = index;
    this.initDialogForm();

    if (exp) {
      this.experienceDialogForm.patchValue({
        role: exp.role,
        company: exp.company,
        description: exp.description,
        present: exp.present || false,
        startDate: exp.startDate ? new Date(exp.startDate) : null,
        endDate: exp.endDate ? new Date(exp.endDate) : null
      });
      const projectsArray = this.experienceDialogForm.get('projects') as FormArray;
      (exp.projects || []).forEach((proj: any) => projectsArray.push(this.createProject(proj)));
    }

    this.showExperienceDialog = true;
  }

  saveExperience(): void {
    if (this.experienceDialogForm.invalid) {
      this.experienceDialogForm.markAllAsTouched();
      return;
    }
    const data = this.experienceDialogForm.value;
    data.startDate = this.formatMonth(data.startDate);
    data.endDate = data.present ? null : this.formatMonth(data.endDate);

    if (this.selectedExperienceIndex !== null) {
      this.experiences.setControl(this.selectedExperienceIndex, this.createExperience(data));
    } else {
      this.experiences.push(this.createExperience(data));
    }
    this.profileForm.markAsDirty();
    this.closeDialog();
  }

  addNewExperience(): void {
    this.isAddingNewExperience = true;
    this.selectedExperienceIndex = null;
    this.initDialogForm();
    this.showExperienceDialog = true;
  }

  cancelExperienceEdit(): void { this.closeDialog(); }
  closeDialog(): void {
    this.showExperienceDialog = false;
    this.selectedExperienceIndex = null;
    this.isAddingNewExperience = false;
  }
  onDialogHide(): void { this.closeDialog(); }

  removeExperience(i: number): void { this.experiences.removeAt(i); }

  addProject(): void { this.projectsArray.insert(0, this.createProject()); }
  removeProject(index: number): void { this.projectsArray.removeAt(index); }

  addTechnology(projectIndex: number, value: string): void {
    if (!value?.trim()) return;
    this.getTechnologiesArray(projectIndex).push(new FormControl(value.trim()));
  }
  addTech(projectIndex: number, input: HTMLInputElement): void {
    const value = input.value.trim();
    if (!value) return;
    const proj = this.projectsArray.at(projectIndex);
    proj.get('technologies')?.setValue([...(proj.get('technologies')?.value || []), value]);
    input.value = '';
  }
  removeTechnology(projectIndex: number, techIndex: number): void {
    this.getTechnologiesArray(projectIndex)?.removeAt(techIndex);
  }
  removeTech(projectIndex: number, techIndex: number): void {
    const proj = this.projectsArray.at(projectIndex);
    const techs = [...proj.get('technologies')?.value];
    techs.splice(techIndex, 1);
    proj.get('technologies')?.setValue(techs);
  }
  getTechs(index: number): string[] {
    return this.projectsArray.at(index).get('technologies')?.value || [];
  }

  // ── File uploads ──────────────────────────────────────────────

  onAvatarChange(ev: Event): void {
    const f = (ev.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { this.avatarDataUrl = reader.result as string; };
    reader.readAsDataURL(f);
    this.profileForm.markAsDirty();
  }

  removeAvatar(): void {
    this.avatarDataUrl = null;
    this.profileForm.patchValue({ avatar: null });
  }

  onResumeChange(ev: Event): void {
    const f = (ev.target as HTMLInputElement).files?.[0];
    if (f) this.applyResumeFile(f);
  }
  onResumeDragOver(ev: DragEvent): void { ev.preventDefault(); }
  onResumeDragLeave(ev: DragEvent): void { ev.preventDefault(); }
  onResumeDrop(ev: DragEvent): void {
    ev.preventDefault();
    const f = ev.dataTransfer?.files?.[0];
    if (f) this.applyResumeFile(f);
  }
  viewResume(): void {
    if (this.resumeUrl) window.open(this.resumeUrl, '_blank');
  }
  removeResume(): void {
    this.resumeUrl = null;
    this.resumeFileName = null;
    this.profileForm.patchValue({ resume: null });
    this.profileForm.get('resume')?.setErrors(null);
  }

  // ── Template helpers ──────────────────────────────────────────

  isFormChanged(): boolean { return this.profileForm.dirty; }

  isFieldInvalid(fieldName: string, group: FormGroup = this.profileForm): boolean {
    const f = group.get(fieldName);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  getErrorText(fieldName: string, group: FormGroup = this.profileForm): string {
    const f = group?.get(fieldName);
    if (!f?.errors) return '';
    if (f.errors['required']) return 'This field is required';
    if (f.errors['maxlength']) return 'Maximum length exceeded';
    if (f.errors['email']) return 'Invalid email address';
    if (f.errors['pattern']) return 'Invalid format';
    if (f.errors['fileType']) return 'Only PDF allowed';
    return 'Invalid value';
  }

  formatDisplayDate(date: any): string {
    if (!date) return 'Not specified';
    try {
      const d = typeof date === 'string' ? this.parseMonthString(date) : date;
      return d ? d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Invalid date';
    } catch { return 'Invalid date'; }
  }

  onDateSelect(date: Date, exp: FormGroup, controlName: 'startDate' | 'endDate'): void {
    exp.get(controlName)?.setValue(date);
  }

  // ── FormArray getters ─────────────────────────────────────────

  get skills(): FormArray    { return this.profileForm.get('skills') as FormArray; }
  get experiences(): FormArray { return this.profileForm.get('experiences') as FormArray; }
  get experienceForms(): FormGroup[] { return this.experiences.controls as FormGroup[]; }
  get themes(): FormArray    { return this.profileForm.get('themes') as FormArray; }
  get projectsArray(): FormArray<FormGroup> { return this.experienceDialogForm.get('projects') as FormArray<FormGroup>; }
  get projectForms(): FormGroup[] { return this.projectsArray.controls as FormGroup[]; }

  addSkill(value = ''): void { if (value?.trim()) this.skills.push(new FormControl(value.trim())); }
  removeSkill(i: number): void { this.skills.removeAt(i); }

  getTechnologiesArray(projectIndex: number): FormArray {
    return this.projectForms[projectIndex].get('technologies') as FormArray;
  }
  getTechnologyControls(projectIndex: number): FormControl[] {
    return this.getTechnologiesArray(projectIndex).controls as FormControl[];
  }

  // ── Lifecycle ─────────────────────────────────────────────────

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Private ───────────────────────────────────────────────────

  private notifyUnread(): void {
    const n = this.appService.notifications();
    if (n && n.unreadCount > 0) {
      this.alertService.showAlert(
        `You have ${n.unreadCount} unread notification${n.unreadCount > 1 ? 's' : ''}`,
        'info'
      );
    }
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      name:           ['', [Validators.maxLength(80)]],
      description:    ['', [Validators.maxLength(600)]],
      email:          ['', [Validators.email]],
      logo_initials:  ['', [Validators.maxLength(3)]],
      primaryPhone:   ['', [Validators.pattern(/^\+?[0-9\s\-]{7,20}$/)]],
      secondaryPhone: [''],
      location:       ['', Validators.maxLength(120)],
      website:        ['', Validators.pattern(/https?:\/\/.+/i)],
      linkedin:       [''],
      github:         [''],
      openToWork:     [false],
      skills:         this.fb.array([]),
      resume:         [null],
      avatar:         [null],
      currentTheme:   ['', [Validators.maxLength(80)]],
      experiences:    this.fb.array([]),
      themes:         this.fb.array([])
    });

    this.passwordForm = this.fb.group({
      email:           ['', [Validators.email]],
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword:     ['', [Validators.required, Validators.minLength(6)]]
    });

    this.initDialogForm();

    this.profileForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.profileForm && !this.profileForm.dirty) this.profileForm.markAsDirty();
    });
  }

  private initDialogForm(): void {
    this.experienceDialogForm = this.fb.group({
      role:        ['', Validators.required],
      company:     ['', Validators.required],
      startDate:   ['', Validators.required],
      endDate:     [''],
      present:     [false],
      description: ['', Validators.maxLength(1000)],
      projects:    this.fb.array([])
    });
    this.initThemeForm();

    this.experienceDialogForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.profileForm) this.profileForm.markAsDirty();
    });
  }

  private initThemeForm(): void {
    const tokenGroup = () => this.fb.group({
      primary:        ['', Validators.required],
      accent:         ['', Validators.required],
      primary_glow:   ['', Validators.required],
      background:     ['', Validators.required],
      surface:        ['', Validators.required],
      surface_alt:    ['', Validators.required],
      text_primary:   ['', Validators.required],
      text_secondary: ['', Validators.required],
      text_muted:     ['', Validators.required],
      success:        ['', Validators.required],
      warning:        ['', Validators.required],
      error:          ['', Validators.required],
      border:         ['', Validators.required]
    });

    this.customThemeForm = this.fb.group({
      theme_name:  ['', Validators.required],
      tokens:      tokenGroup(),
      dark_tokens: tokenGroup()
    });

    this.customThemeForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.profileForm) this.profileForm.markAsDirty();
    });
  }

  private patchFromProfile(p: Profile | null): void {
    if (!p) return;

    this.profileForm.patchValue({
      name:           p.full_name ?? '',
      description:    p.description ?? '',
      email:          p.email ?? '',
      logo_initials:  p.logo_initials ?? '',
      primaryPhone:   p.primary_phone ?? '',
      secondaryPhone: p.secondary_phone ?? '',
      location:       p.location ?? '',
      website:        p.website ?? '',
      linkedin:       this.decodeHtml(p.linkedin ?? ''),
      github:         this.decodeHtml(p.github ?? ''),
      openToWork:     !!p.open_to_work
    });
    this.passwordForm.patchValue({ email: p.email ?? '' });

    while (this.skills.length) this.skills.removeAt(0);
    (p.skills || []).forEach(s => this.skills.push(new FormControl(s)));

    while (this.experiences.length) this.experiences.removeAt(0);
    (p.experiences || []).forEach(e => {
      this.experiences.push(this.createExperience({
        ...e,
        startDate: e.startDate ? this.parseMonthString(e.startDate) : null,
        endDate:   e.endDate   ? this.parseMonthString(e.endDate)   : null,
        projects:  e.projects  || []
      }));
    });

    this.themesList = this.normalizeThemesResponse(p.themes || []);
    this.applyThemeFromProfile(p);

    if (p.currenttheme) this.currentTheme = p.currenttheme;

    this.avatarDataUrl = p.avatar_url ?? null;
    if (p.resume_url) {
      this.resumeUrl = p.resume_url;
      this.resumeFileName = 'Resume.pdf';
      this.profileForm.patchValue({ resume: p.resume_url });
      this.profileForm.get('resume')?.setErrors(null);
    } else {
      this.resumeUrl = null;
      this.resumeFileName = null;
    }

    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
  }

  private buildProfilePayload(): Partial<Profile> {
    const v = this.profileForm.value;
    return {
      full_name:      v.name,
      description:    v.description,
      email:          v.email,
      logo_initials:  v.logo_initials,
      primary_phone:  v.primaryPhone,
      secondary_phone: v.secondaryPhone,
      location:       v.location,
      website:        v.website,
      linkedin:       v.linkedin,
      github:         v.github,
      open_to_work:   v.openToWork,
      currenttheme:   this.currentTheme,
      avatar_url:     this.avatarDataUrl ?? undefined,
      resume_url:     this.resumeUrl ?? undefined,
      skills:         this.skills.value,
      themes:         this.themesList,
      experiences:    this.experiences.value.map((exp: any) => ({
        ...exp,
        startDate: exp.startDate ? this.formatMonth(exp.startDate) : '',
        endDate:   exp.endDate   ? this.formatMonth(exp.endDate)   : ''
      }))
    };
  }

  private applyResumeFile(file: File): void {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.profileForm.get('resume')?.setErrors({ fileType: true });
      return;
    }
    this.resumeFileName = file.name;
    this.resumeUrl = URL.createObjectURL(file);
    this.profileForm.patchValue({ resume: file });
    this.profileForm.get('resume')?.setErrors(null);
    this.profileForm.markAsDirty();
  }

  private createExperience(data?: any): FormGroup {
    return this.fb.group({
      role:        [data?.role || '', Validators.required],
      company:     [data?.company || '', Validators.required],
      startDate:   [data?.startDate || '', Validators.required],
      endDate:     [data?.endDate || ''],
      present:     [!!data?.present],
      description: [data?.description || '', Validators.maxLength(1000)],
      projects:    this.fb.array((data?.projects || []).map((p: any) => this.createProject(p)))
    });
  }

  private createProject(data?: any): FormGroup {
    return this.fb.group({
      title:           [data?.title || '', Validators.required],
      description:     [data?.description || ''],
      projectProgress: [data?.projectProgress || ''],
      url:             [data?.url || ''],
      technologies:    this.fb.array(data?.technologies || [])
    });
  }

  private parseMonthString(monthStr: any): Date | null {
    if (!monthStr) return null;
    if (monthStr instanceof Date) return monthStr;
    if (typeof monthStr === 'string' && /^\d{4}-\d{2}$/.test(monthStr)) {
      const [year, month] = monthStr.split('-').map(Number);
      if (!year || !month || month < 1 || month > 12) return null;
      return new Date(year, month - 1, 1);
    }
    return null;
  }

  private formatMonth(date: Date | null): string | null {
    if (!date) return null;
    if (typeof date === 'string' && /^\d{4}-\d{2}$/.test(date)) return date;
    if (date instanceof Date) {
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${y}-${m}`;
    }
    return null;
  }
}
