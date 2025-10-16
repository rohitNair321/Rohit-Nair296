import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class SupabaseService {

  private readonly edge = `${environment.supabaseUrl}/functions/v1`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<{ home: any; aboutMe: any }> {
    return this.http.get<{ home: any; aboutMe: any }>(`${this.edge}/get-profile`);
  }

  listProjects(params?: { featured?: boolean; limit?: number }): Observable<Project[]> {
    let httpParams = new HttpParams();
    if (params?.featured !== undefined) httpParams = httpParams.set('featured', String(params.featured));
    if (params?.limit !== undefined) httpParams = httpParams.set('limit', String(params.limit));
    return this.http.get<Project[]>(`${this.edge}/list-projects`, { params: httpParams });
  }

  submitContact(payload: { name: string; email: string; subject?: string; message: string }): Observable<SubmitContactResponse> {
    return this.http.post<SubmitContactResponse>(`${this.edge}/submit-contact`, payload);
  }

}

export interface Project {
  id: string;
  title: string;
  description?: string;
  technologies?: string[];
  live_demo?: string | null;
  source_code?: string | null;
  featured?: boolean;
  created_at?: string;
}

export interface SubmitContactResponse {
  ok: boolean;
  id: string | null;
}
