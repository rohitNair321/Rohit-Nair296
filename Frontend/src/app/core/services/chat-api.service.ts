import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { MOCK_BALANCE, MOCK_USAGE_RESPONSE, SEED_CHAT_SESSIONS } from '../mock-data/mock-data';

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

const STORAGE_KEY = 'aing_sessions_v2';

function loadSessions(): ChatSessionDto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ChatSessionDto[];
  } catch { /* ignore */ }
  // Seed with sample conversations on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CHAT_SESSIONS));
  return SEED_CHAT_SESSIONS;
}

function saveSessions(sessions: ChatSessionDto[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 20)));
  } catch { /* ignore */ }
}

@Injectable({ providedIn: 'root' })
export class ChatApiService {

  createSession(title: string): Observable<ChatSessionDto> {
    const session: ChatSessionDto = {
      id: `sess-${Date.now()}`,
      title: title || 'New chat',
      model: 'v2.5s',
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const sessions = loadSessions();
    sessions.unshift(session);
    saveSessions(sessions);
    return of(session).pipe(delay(150));
  }

  getSessions(): Observable<ChatSessionDto[]> {
    return of(loadSessions()).pipe(delay(200));
  }

  getSession(id: string): Observable<ChatSessionDto> {
    const session = loadSessions().find(s => s.id === id);
    return of(session!).pipe(delay(100));
  }

  saveMessage(sessionId: string | null, sender: 'user' | 'bot', message: string): Observable<any> {
    if (!sessionId) return of(null);
    const sessions = loadSessions();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx !== -1) {
      sessions[idx].messages.push({ sender, text: message, time: new Date().toISOString() });
      sessions[idx].updated_at = new Date().toISOString();
      saveSessions(sessions);
    }
    return of({ success: true }).pipe(delay(50));
  }

  getUsage(_params?: { userId?: string; sessionId?: string; range?: string }): Observable<UsageResponse> {
    return of(MOCK_USAGE_RESPONSE).pipe(delay(300));
  }

  getBalance(): Observable<BalanceResponse> {
    return of(MOCK_BALANCE).pipe(delay(200));
  }

  getMessages(sessionId: string): Observable<ChatSessionDto[]> {
    return this.getSessions();
  }

  deleteSession(id: string): Observable<any> {
    const sessions = loadSessions().filter(s => s.id !== id);
    saveSessions(sessions);
    return of({ success: true }).pipe(delay(100));
  }

  deleteAllSessions(): Observable<any> {
    saveSessions([]);
    return of({ success: true }).pipe(delay(100));
  }
}
