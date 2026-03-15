import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { AppService } from "./app.service";

export interface ChatJsonMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export interface ChatSessionDto {
  id: string;
  title: string;
  model?: string;
  user_id?: string;
  messages: ChatJsonMessage[];
  created_at: string;
  updated_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatApiService {

    private readonly apiChatSessionsUrl = environment.baseUrl + '/api/chat';
    private appService = inject(AppService);

    constructor(private http: HttpClient) { }

    createSession(title: string): Observable<ChatSessionDto> {
        return this.http.post<ChatSessionDto>(
            `${this.apiChatSessionsUrl}/createSession`,
            {
                title,
                model: "o4-mini",
                userId: this.appService.profile()?.id
            }
        );
    }

    getSessions(): Observable<ChatSessionDto[]> {
        return this.http.get<ChatSessionDto[]>(`${this.apiChatSessionsUrl}/getSessions`);
    }

    getSession(id: string): Observable<ChatSessionDto> {
        return this.http.get<ChatSessionDto>(
            `${this.apiChatSessionsUrl}/getSessionById/${id}`
        );
    }

    saveMessage(
        sessionId: string | null,
        sender: 'user' | 'bot',
        message: string
    ): Observable<any> {
        return this.http.post(
            `${this.apiChatSessionsUrl}/message`,
            {
                sessionId,
                sender,
                message,
                userId: this.appService.profile()?.id
            }
        );
    }


    getMessages(sessionId: string): Observable<ChatSessionDto[]> {
        return this.http.get<ChatSessionDto[]>(
            `${this.apiChatSessionsUrl}/messages/${sessionId}`
        );
    }



    deleteSession(id: string) {
        return this.http.delete(`${this.apiChatSessionsUrl}/session/${id}`);
    }

    deleteAllSessions() {
        return this.http.delete(`${this.apiChatSessionsUrl}/sessions`);
    }

}