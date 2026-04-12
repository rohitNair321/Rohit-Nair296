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

export interface UsageSummary {
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
}

export interface UsageTrend {
    date: string;
    tokens: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    requests: number;
}

export interface ModelBreakdown {
    model: string;
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    requests: number;
}

export interface RoleBlock {
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    requests: number;
}

export interface SessionSummary {
    sessionId: string;
    date: string;
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    requests: number;
    model: string;
}

export interface AllTimeBlock {
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    totalRequests: number;
    totalCost: number;
}

export interface UsageResponse {
    summary: UsageSummary;
    trend: UsageTrend[];
    byModel: ModelBreakdown[];
    byRole: { admin: RoleBlock; guest: RoleBlock };
    sessions: SessionSummary[];
    allTime: AllTimeBlock;
}

export interface BalanceResponse {
    source: 'openai' | 'supabase';
    totalUsedUSD: number;
    hardLimitUSD: number | null;
    remainingUSD: number | null;
    remainingPct: number | null;
}

@Injectable({
    providedIn: 'root'
})
export class ChatApiService {

    private readonly apiChatSessionsUrl = '';
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
        return this.http.get<ChatSessionDto[]>(`${this.apiChatSessionsUrl}/getSessions`, { withCredentials: true });
    }

    getSession(id: string): Observable<ChatSessionDto> {
        return this.http.get<ChatSessionDto>(
            `${this.apiChatSessionsUrl}/getSessionById/${id}`, { withCredentials: true });
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
            },
            { withCredentials: true }
        );
    }

    getUsage(params?: {
        userId?: string;
        sessionId?: string;
        range?: string;
    }) {
        return this.http.get<any>(`${this.apiChatSessionsUrl}/usage`, { params: params as any, withCredentials: true });
    }

    getBalance(): Observable<BalanceResponse> {
        return this.http.get<BalanceResponse>(`${this.apiChatSessionsUrl}/balance`, { withCredentials: true });
    }

    getMessages(sessionId: string): Observable<ChatSessionDto[]> {
        return this.http.get<ChatSessionDto[]>(
            `${this.apiChatSessionsUrl}/messages/${sessionId}`, { withCredentials: true }
        );
    }

    deleteSession(id: string) {
        return this.http.delete(`${this.apiChatSessionsUrl}/deleteSessionById/${id}`, { withCredentials: true });
    }

    deleteAllSessions() {
        return this.http.delete(`${this.apiChatSessionsUrl}/deleteAllSessions`, { withCredentials: true });
    }

}