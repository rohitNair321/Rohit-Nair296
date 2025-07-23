import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  private PROXY_URL = environment.supabaseUrl + '/functions/v1/proxy-gemini';

  constructor(private http: HttpClient) {}

  sendMessage(userMessage: AiRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.supabaseKey}`
    });
    const body = {
      text: userMessage.message,
      modelVersion: userMessage.modelVersion,
    };

    return this.http.post(this.PROXY_URL, body, {headers} );
  }
}


export interface AiRequest {
  message: string;
  modelVersion: string;
}