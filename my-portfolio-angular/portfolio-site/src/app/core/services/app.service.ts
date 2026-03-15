import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, Signal, signal } from "@angular/core";
import * as e from "cors";
import { map, Observable, tap } from "rxjs";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { environment } from "src/environments/environments";

export type UserRole = 'ADMIN' | 'GUEST' | null;
@Injectable({ providedIn: 'root' })
export class AppService {

    private readonly http = inject(HttpClient);
    private localStorageService = inject(LocalStorageService);

    // Single source of truth
    appState = signal<AppState>(initialState);
    role = signal<UserRole>(null);
    private readonly apiProfileUrl = environment.baseUrl + '/api/profile';
    private readonly apiContactUrl = environment.baseUrl + '/api/contact';
    private readonly apiAIChatUrl = environment.baseUrl + '/api/ai/chat';

    _profile = signal<Profile | null>(null);
    readonly profile: Signal<Profile | null> = this._profile;

    _notifications = signal<Notification | null>(null);
    readonly notifications: Signal<Notification | null> = this._notifications;

    token = signal<string | null>(this.localStorageService.getItem('auth_token'));

    private authHeaders(): HttpHeaders {
        const token = this.token() || this.localStorageService.getItem('auth_token');
        return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
    }

    hasValidToken(): boolean {
        const token = localStorage.getItem('auth_token');
        if (!token) return false;
        return true;
    }


    // Fetch profile from server and update signal
    getProfile(): Observable<Profile | null> {
        return this.http.get<{ profile: Profile | null }>(`${this.apiProfileUrl}/getMyProfile`)
            .pipe(
                map(r => r.profile || null),
                tap(p => this._profile.set(p))
            );
    }

    updateProfile(formData: FormData): Observable<Profile> {
        return this.http.put<{ profile: Profile }>(`${this.apiProfileUrl}/saveUpdateMyProfile`, formData, {
            headers: this.authHeaders() // HttpClient will set Content-Type automatically for FormData
        }).pipe(
            map(r => r.profile),
            tap(updated => this._profile.set(updated))
        );
    }

    getResumeSignedUrl(): Observable<{ url: string, expires_in: number }> {
        return this.http.get<{ url: string, expires_in: number }>(`${this.apiProfileUrl}/me/resume`, { headers: this.authHeaders() });
    }

    setLocalProfile(profile: Profile | null) {
        this._profile.set(profile);
    }

    sendContactMessage(formData: any): Observable<any> {
        return this.http.post<any>(`${this.apiContactUrl}/send`, formData).pipe(
            map((res) => {
                return res;
            })
        );
    }

    getNotifications(): Observable<Notification> {
        return this.http.get<Notification>(`${this.apiContactUrl}/notifications`, { headers: this.authHeaders() }).pipe(
            map(notification => notification || null),
            tap(notification => this._notifications.set(notification))
        );
    }

    markMessageAsRead(id: string): Observable<Notification> {
        return this.http.put<Notification>(`${this.apiContactUrl}/notifications/${id}/read`, { headers: this.authHeaders() }).pipe(
            map(notification => notification || null),
            tap(notification => this._notifications.set(notification))
        );
    }

    deleteMessage(id: string): Observable<Notification> {
        return this.http.delete<Notification>(`${this.apiContactUrl}/delete/${id}`, { headers: this.authHeaders() }).pipe(
            map(notification => notification || null),
            tap(notification => this._notifications.set(notification))
        );
    }

    setRole(newRole: UserRole) {
        this.role.set(newRole);
    }

    // A simple check to see if we should allow entry to the app
    isAuthorized(): boolean {
        const hasToken = !!this.localStorageService.getItem('auth_token');
        const isGuest = this.role() === 'GUEST';
        return hasToken || isGuest;
    }

    intialAppState() {
        this.appState.set(initialState);
        this.localStorageService.clear();
    }

    aiChat(message: string, sessionId: string | null): Observable<AiChatResponse> {
        return this.http.post<AiChatResponse>(this.apiAIChatUrl, { message, sessionId, userId: this.profile()?.id, role: this.role() });
    }


}

interface AppState {
    role: UserRole;
    token: string | null;
    _profile: Profile | null;
    _notification: Notification | null;
}

const initialState: AppState = {
    role: null,
    token: null,
    _profile: null,
    _notification: null
};

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
    avatar_url?: string; // public url for avatar (if public)
    resume_url?: string; // stored path on server (not public url)
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
