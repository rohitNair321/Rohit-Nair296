import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, switchMap, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environments';

type UploadKind = 'profile_image' | 'resume';


@Injectable({ providedIn: 'root' })
export class SupabaseService {

  private readonly edgeBaseUrl = `${environment.supabaseUrl}/functions/v1`;
  private readonly reqTimeoutMs = 8000;
  private readonly retryCount = 2;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.edgeBaseUrl}/get-profile`).pipe(
      timeout(this.reqTimeoutMs),
      retry({ count: this.retryCount, delay: 300 }),
      catchError(err => throwError(() => this.normalizeError(err, 'Failed to load profile')))
    );;
  }

  /** Fetch a single project by id (string UUID or numeric string based on your schema) */
  getProjectById(id: string): Observable<Project> {
    const params = new HttpParams().set('id', id);
    return this.http
      .get<{ project: Project }>(`${this.edgeBaseUrl}/get-project-by-id`, { params })
      .pipe(
        timeout(this.reqTimeoutMs),
        retry({ count: this.retryCount, delay: 300 }),
        map(res => res.project),
        catchError(err => throwError(() => this.normalizeError(err, 'Failed to load project')))
      );
  }

  listProjects(params?: { featured?: boolean; limit?: number }): Observable<Project[]> {
    let httpParams = new HttpParams();
    if (params?.featured !== undefined) httpParams = httpParams.set('featured', String(params.featured));
    if (params?.limit !== undefined) httpParams = httpParams.set('limit', String(params.limit));
    return this.http.get<Project[]>(`${this.edgeBaseUrl}/list-projects`, { params: httpParams });
  }

  submitContact(payload: { name: string; email: string; subject?: string; message: string }): Observable<SubmitContactResponse> {
    return this.http.post<SubmitContactResponse>(`${this.edgeBaseUrl}/submit-contact`, payload);
  }

  /**
     * Upload a profile image using a one-time signed URL.
     *  - Validates file type/size
     *  - Requests signed URL from Edge Function (create-upload-url)
     *  - PUTs the file to Storage
     *  - Returns { publicUrl, path }
     */
  uploadProfileImage(file: File): Observable<UploadResult> {
    this.assertImage(file);
    return this.createSignedUploadUrl('profile_image', file.name, file.type).pipe(
      switchMap(({ signedUrl, publicUrl, path }) => {
        const headers = new HttpHeaders({
          'Content-Type': file.type || 'application/octet-stream',
        });
        return this.http.put(signedUrl, file, { headers, responseType: 'text' }).pipe(
          map(() => ({ publicUrl, path }))
        );
      }),
      timeout(this.reqTimeoutMs),
      retry({ count: this.retryCount, delay: 300 }),
      catchError((err) => throwError(() => this.normalizeError(err, 'Image upload failed')))
    );
  }

  /**
   * Upload a resume (PDF) using a one-time signed URL.
   *  - Validates file type/size
   *  - Requests signed URL
   *  - PUTs to Storage
   *  - Returns { publicUrl, path }
   */
  uploadResume(file: File): Observable<UploadResult> {
    this.assertResume(file);
    return this.createSignedUploadUrl('resume', file.name, file.type).pipe(
      switchMap(({ signedUrl, publicUrl, path }) => {
        const headers = new HttpHeaders({
          'Content-Type': file.type || 'application/pdf',
        });
        return this.http.put(signedUrl, file, { headers, responseType: 'text' }).pipe(
          map(() => ({ publicUrl, path }))
        );
      }),
      timeout(this.reqTimeoutMs),
      retry({ count: 1, delay: 500 }),
      catchError((err) => throwError(() => this.normalizeError(err, 'Resume upload failed')))
    );
  }

  /**
   * OPTIONAL convenience method:
   * After upload, persist the returned public URLs into your profile row
   * via an Edge Function you control (e.g., update-profile-asset-urls).
   * If you don’t have this function yet, skip using this and update via your existing API.
   */
  saveProfileAssetUrls(
    profileId: string,
    patch: { profile_image_url?: string; resume_url?: string }
  ): Observable<void> {
    // Replace with your actual function name if different:
    return this.http
      .post<{ ok: boolean; error?: string }>(`${this.edgeBaseUrl}/update-profile-asset-urls`, {
        profile_id: profileId,
        ...patch,
      })
      .pipe(
        timeout(this.reqTimeoutMs),
        map((res) => {
          if (!res.ok) throw new Error(res.error || 'Failed to update profile asset URLs');
          return;
        }),
        catchError((err) =>
          throwError(() => this.normalizeError(err, 'Failed to update profile asset URLs'))
        )
      );
  }

  // ---------------------- Private helpers ----------------------

  /** Calls Edge Function to create a signed upload URL for Storage */
  private createSignedUploadUrl(
    kind: UploadKind,
    filename: string,
    mime: string
  ): Observable<SignedUploadResponse> {
    const body = { kind, filename, mime };
    return this.http
      .post<SignedUploadResponse>(`${this.edgeBaseUrl}/create-upload-url`, body)
      .pipe(
        timeout(this.reqTimeoutMs),
        catchError((err) =>
          throwError(() => this.normalizeError(err, 'Could not create signed upload URL'))
        )
      );
  }

  private assertImage(file: File) {
    const ok = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ok.includes(file.type)) {
      throw new Error('Only JPEG, PNG, or WEBP images are allowed.');
    }
    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) throw new Error(`Image must be <= ${maxMB}MB.`);
  }

  private assertResume(file: File) {
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF resumes are allowed.');
    }
    const maxMB = 10;
    if (file.size > maxMB * 1024 * 1024) throw new Error(`Resume must be <= ${maxMB}MB.`);
  }

  private normalizeError(err: any, fallback: string): Error {
    const message = err?.error?.error || err?.error?.message || err?.message || fallback;
    return new Error(message);
  }

}

export interface SignedUploadResponse {
  bucket: string;          // e.g. "public"
  path: string;            // e.g. "avatars/1111.../photo.webp" or "resumes/Rohit.Nair.pdf"
  signedUrl: string;       // pre-signed PUT URL
  publicUrl: string;       // computed by the function for convenience
  // token?: string;       // (optional) if you choose to return a token for SDK helpers
}

export interface UploadResult {
  path: string;
  publicUrl: string;
}

export interface Project {
  id: string;
  profile_id?: string | null;
  title: string;
  slug?: string | null;
  description?: string | null;
  technologies?: string[] | null;
  images?: string[] | null;        // Can hold URLs or storage paths
  live_demo?: string | null;
  source_code?: string | null;
  featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SubmitContactResponse {
  ok: boolean;
  id: string | null;
}


// src/app/core/models/profile.model.ts

/** Top-level response from get-profile */
export interface ProfileResponse {
  home: HomeSection;
  aboutMe: AboutMeSection;
}

/** ---------------- Home ---------------- */
export interface HomeSection {
  hero: Hero;
  contact: HomeContact;
  projects: ProjectCard[];
  aboutTeaser: AboutTeaser;
}

export interface Hero {
  name: string;
  title: string;
  resume: string;                // e.g., "assets/Rohit.Nair.pdf"
  skills: string[];              // ["Angular","TypeScript","HTML/CSS"]
  description: string;
  profileImage: string;          // URL
}

export interface HomeContact {
  email: string;
  phone: string;                 // Keep as string to preserve formatting like "+91-... / ..."
  address: string;
  headingText: string;
  subHeadingText: string;
}

export interface ProjectCard {
  title: string;
  featured: boolean;
  liveDemo: string;              // may be "" -> still a string
  sourceCode: string;            // may be "" -> still a string
  description: string;
  technologies: string[];
}

export interface AboutTeaser {
  photo: string;                 // e.g., "assets/images/profile.jpg"
  title: string;
  resume: string;
  /** Contains inline HTML spans with classes; render via [innerHTML] in Angular */
  description: string;
}

/** ---------------- About Me ---------------- */
export interface AboutMeSection {
  name: string;
  title: string;
  resume: string;
  skills: Skills;
  contact: AboutContact;
  summary: string;
  education: EducationItem[];
  strengths: string[];
  workExperience: WorkExperience[];
  industryExperience: string[];
}

export interface Skills {
  languages: string[];
  toolsPractices: string[];
  webTechnologies: string[];
  frameworksLibraries: string[];
}

export interface AboutContact {
  email: string;
  phone: string;
  location: string;
}

export interface EducationItem {
  year: string;                  // "2021" etc. (keep string as per payload)
  degree: string;
  institution: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  duration: string;              // "August 2024 - Present"
  location: string;
  projects: ExperienceProject[];
  responsibilities: string[];    // top-level bullets under this employment
}

export interface ExperienceProject {
  title: string;
  client?: string;               // present for some projects only
  responsibilities: string[];    // bullets within the project
}
