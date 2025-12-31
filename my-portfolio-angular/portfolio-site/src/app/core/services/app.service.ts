import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, Signal, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { environment } from "src/environments/environments";


@Injectable({ providedIn: 'root' })
export class AppService {

    private readonly http = inject(HttpClient);
    private readonly apiBaseUrl = environment.baseUrl + '/api/profile';

    private _profile = signal<Profile | null>(null);
    readonly profile: Signal<Profile | null> = this._profile;

    token = signal<string | null>(null);

    private authHeaders(): HttpHeaders {
        const token = this.token() || localStorage.getItem('auth_token');
        return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
    }

    getToken(): Observable<string> {
        return this.http.get<any>(`${this.apiBaseUrl}/token`).pipe(
            map((res) => {
                this.token.set(res.token);
                localStorage.setItem('auth_token', res.token);
                return res.token;
            })
        );
    }

    // Fetch profile from server and update signal
    getProfile(): Observable<Profile | null> {
        return this.http.get<{ profile: Profile | null }>(`${this.apiBaseUrl}/getMyProfile`, { headers: this.authHeaders() })
            .pipe(
                map(r => r.profile || null),
                tap(p => this._profile.set(p))
            );
    }

    // Update profile (multipart FormData) — returns updated profile
    updateProfile(formData: FormData): Observable<Profile> {
        return this.http.put<{ profile: Profile }>(`${this.apiBaseUrl}/saveUpdateMyProfile`, formData, {
            headers: this.authHeaders() // HttpClient will set Content-Type automatically for FormData
        }).pipe(
            map(r => r.profile),
            tap(updated => this._profile.set(updated))
        );
    }

    // Get signed resume url (server returns { url, expires_in })
    getResumeSignedUrl(): Observable<{ url: string, expires_in: number }> {
        return this.http.get<{ url: string, expires_in: number }>(`${this.apiBaseUrl}/me/resume`, { headers: this.authHeaders() });
    }

    // Convenience: update only local signal without hitting server (optimistic update)
    setLocalProfile(profile: Profile | null) {
        this._profile.set(profile);
    }
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
