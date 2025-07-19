import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  private PROXY_URL = environment.supabaseUrl + '/functions/v1/ai-chat'; // 👈 update with your edge function

  constructor(private http: HttpClient) {}

  sendMessage(userMessage: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.supabaseKey}`  // 👈 Required for authentication
    });
    const body = {
      text: userMessage
    };

    return this.http.post(this.PROXY_URL, body, {headers} );
  }
}
