import { Injectable, Signal, signal } from "@angular/core";
import { delay, map, Observable, of, tap } from "rxjs";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { inject } from "@angular/core";
import { MOCK_NOTIFICATIONS, MOCK_PROFILE, BOT_RESPONSES } from "../mock-data/mock-data";

export type UserRole = 'ADMIN' | 'GUEST' | null;

@Injectable({ providedIn: 'root' })
export class AppService {

  private localStorageService = inject(LocalStorageService);

  role = signal<UserRole>(null);

  _profile = signal<Profile | null>(null);
  readonly profile: Signal<Profile | null> = this._profile;

  _notifications = signal<Notification | null>(null);
  readonly notifications: Signal<Notification | null> = this._notifications;

  token = signal<string | null>(this.localStorageService.getItem('auth_token'));

  constructor() {
    const savedProfile = this.localStorageService.getItem('demo_profile');
    this._profile.set(savedProfile ? { ...MOCK_PROFILE, ...JSON.parse(savedProfile) } : MOCK_PROFILE);

    const savedNotifications = this.localStorageService.getItem('demo_notifications');
    this._notifications.set(savedNotifications ? JSON.parse(savedNotifications) : MOCK_NOTIFICATIONS);
  }

  hasValidToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getProfile(): Observable<Profile | null> {
    return of(this._profile()).pipe(tap(p => this._profile.set(p!)));
  }

  updateProfile(data: Partial<Profile>): Observable<Profile> {
    const current = this._profile() ?? MOCK_PROFILE;
    const updated: Profile = { ...current, ...data, updated_at: new Date().toISOString() };
    this.localStorageService.setItem('demo_profile', JSON.stringify(updated));
    return of(updated).pipe(delay(300), tap(p => this._profile.set(p)));
  }

  getResumeSignedUrl(): Observable<{ url: string; expires_in: number }> {
    return of({ url: 'assets/Rohit.Nair.pdf', expires_in: 3600 });
  }

  setLocalProfile(profile: Profile | null) {
    this._profile.set(profile);
  }

  sendContactMessage(_formData: any): Observable<any> {
    return of({ success: true, message: 'Message received! (demo mode)' }).pipe(delay(600));
  }

  // Loads mock notifications and sets the signal once
  getNotifications(): Observable<Notification> {
    const saved = this.localStorageService.getItem('demo_notifications');
    const data: Notification = saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
    return of(data).pipe(
      delay(400),
      tap(n => this._notifications.set(n))
    );
  }

  markMessageAsRead(id: string): Observable<Notification> {
    const current = this._notifications();
    if (!current) return of(MOCK_NOTIFICATIONS);

    const updated: Notification = {
      ...current,
      notificationList: current.notificationList.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, current.unreadCount - (current.notificationList.find(n => n.id === id)?.is_read ? 0 : 1)),
    };
    this._notifications.set(updated);
    this.localStorageService.setItem('demo_notifications', JSON.stringify(updated));
    return of(updated);
  }

  deleteMessage(id: string): Observable<Notification> {
    const current = this._notifications();
    if (!current) return of(MOCK_NOTIFICATIONS);

    const removing = current.notificationList.find(n => n.id === id);
    const updated: Notification = {
      ...current,
      notificationList: current.notificationList.filter(n => n.id !== id),
      unreadCount: Math.max(0, current.unreadCount - (removing && !removing.is_read ? 1 : 0)),
    };
    this._notifications.set(updated);
    this.localStorageService.setItem('demo_notifications', JSON.stringify(updated));
    return of(updated);
  }

  setRole(newRole: UserRole) {
    this.role.set(newRole);
  }

  isAuthorized(): boolean {
    const hasToken = !!this.localStorageService.getItem('auth_token');
    const isGuest = this.role() === 'GUEST';
    return hasToken || isGuest;
  }

  intialAppState() {
    this._profile.set(null);
    this._notifications.set(null);
    this.role.set(null);
    this.localStorageService.clear();
  }

  aiChat(message: string, _sessionId: string | null): Observable<AiChatResponse> {
    const reply = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
    return of({ response: reply, sessionId: _sessionId ?? `session-${Date.now()}`, limitReached: false }).pipe(
      delay(800 + Math.random() * 600)
    );
  }
}

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface Notification {
  notificationList: NotificationDTO[];
  success: string;
  unreadCount: number;
}

export interface NotificationDTO {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactMessage {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
}

export interface Experience {
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  present?: boolean;
  description?: string;
}

export interface Profile {
  id?: string;
  full_name?: string;
  description?: string;
  email?: string;
  primary_phone?: string;
  logo_initials?: string;
  secondary_phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  open_to_work?: boolean;
  skills?: string[];
  experiences?: ExperienceDTO[];
  currenttheme?: string;
  themes?: ThemeDefinition[];
  avatar_url?: string;
  resume_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdateDTO {
  full_name?: string;
  description?: string;
  email?: string;
  primary_phone?: string;
  secondary_phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  open_to_work?: boolean;
  skills?: string[];
  experiences?: ExperienceDTO[];
  avatar?: File;
  resume?: File;
}

export interface ExperienceDTO {
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  present?: boolean;
  description?: string;
  projects?: ProjectDTO[];
}

export interface ProjectDTO {
  name: string;
  description?: string;
  techStack?: string[];
  link?: string;
  highlights?: string[];
}

export interface ThemeDefinition {
  id: string;
  name: string;
  tokens: Record<string, string>;
  darkTokens?: Record<string, string>;
}

interface AiChatResponse {
  response: string;
  sessionId: string;
  limitReached?: boolean;
}
