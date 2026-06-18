import { Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AnalyticsDashboard {
  pageViews: PageView[];
  visitorStats: VisitorStats;
  geographic: GeographicData[];
  devices: DeviceData[];
  traffic: TrafficSource[];
  topPages: TopPage[];
  dateRange: { startDate: string; endDate: string };
}

export interface PageView {
  date: string;
  pageViews: number;
  sessions: number;
}

export interface VisitorStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  sessions: number;
  avgSessionDuration: number;
  bounceRate: number;
}

export interface GeographicData {
  country: string;
  city: string;
  users: number;
  sessions: number;
}

export interface DeviceData {
  device: string;
  os: string;
  users: number;
  sessions: number;
}

export interface TrafficSource {
  source: string;
  medium: string;
  sessions: number;
  users: number;
}

export interface TopPage {
  path: string;
  title: string;
  pageViews: number;
  avgDuration: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

function pastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

const MOCK_ANALYTICS: AnalyticsDashboard = {
  pageViews: Array.from({ length: 30 }, (_, i) => ({
    date: pastDate(29 - i),
    pageViews: Math.floor(Math.random() * 800) + 200,
    sessions:  Math.floor(Math.random() * 500) + 120,
  })),
  visitorStats: {
    totalUsers:          4_812,
    newUsers:            3_241,
    activeUsers:         1_089,
    sessions:            6_304,
    avgSessionDuration:  187,
    bounceRate:          0.42,
  },
  geographic: [
    { country: 'United States', city: 'New York',       users: 1_820, sessions: 2_340 },
    { country: 'India',         city: 'Bengaluru',      users:   910, sessions: 1_190 },
    { country: 'United Kingdom',city: 'London',         users:   540, sessions:   690 },
    { country: 'Germany',       city: 'Berlin',         users:   412, sessions:   530 },
    { country: 'Canada',        city: 'Toronto',        users:   388, sessions:   495 },
    { country: 'Australia',     city: 'Sydney',         users:   276, sessions:   354 },
    { country: 'France',        city: 'Paris',          users:   218, sessions:   281 },
    { country: 'Brazil',        city: 'São Paulo',      users:   194, sessions:   248 },
    { country: 'Netherlands',   city: 'Amsterdam',      users:   142, sessions:   183 },
    { country: 'Singapore',     city: 'Singapore',      users:   112, sessions:   145 },
  ],
  devices: [
    { device: 'desktop', os: 'Windows', users: 2_640, sessions: 3_410 },
    { device: 'mobile',  os: 'iOS',     users: 1_430, sessions: 1_890 },
    { device: 'mobile',  os: 'Android', users:   560, sessions:   720 },
    { device: 'tablet',  os: 'iPadOS',  users:   182, sessions:   284 },
  ],
  traffic: [
    { source: 'Direct',    medium: 'none',    sessions: 2_120, users: 1_680 },
    { source: 'Organic',   medium: 'search',  sessions: 1_840, users: 1_420 },
    { source: 'GitHub',    medium: 'referral',sessions:   920, users:   740 },
    { source: 'LinkedIn',  medium: 'social',  sessions:   640, users:   510 },
    { source: 'Twitter',   medium: 'social',  sessions:   420, users:   330 },
    { source: 'dev.to',    medium: 'referral',sessions:   364, users:   288 },
  ],
  topPages: [
    { path: '/',           title: 'Home',           pageViews: 3_240, avgDuration: 142 },
    { path: '/admin',      title: 'Dashboard',      pageViews: 1_860, avgDuration: 312 },
    { path: '/auth/login', title: 'Login',          pageViews:   980, avgDuration:  68 },
    { path: '/#features',  title: 'Features',       pageViews:   720, avgDuration: 188 },
    { path: '/#theming',   title: 'Theme Demo',     pageViews:   540, avgDuration: 225 },
  ],
  dateRange: { startDate: pastDate(29), endDate: pastDate(0) },
};

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  dashboardData = signal<AnalyticsDashboard | null>(null);
  loading       = signal(false);
  error         = signal<string | null>(null);

  getDashboard(_startDate: string = '7daysAgo', _endDate: string = 'today'): Observable<any> {
    this.loading.set(true);
    this.error.set(null);
    return of({ data: MOCK_ANALYTICS }).pipe(
      delay(450),
      tap({
        next: (response) => {
          this.dashboardData.set(response.data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to fetch analytics data');
          this.loading.set(false);
        },
      })
    );
  }

  getPageViews(_start = '7daysAgo', _end = 'today'): Observable<any> {
    return of({ data: MOCK_ANALYTICS.pageViews }).pipe(delay(300));
  }

  getVisitorStats(_start = '7daysAgo', _end = 'today'): Observable<any> {
    return of({ data: MOCK_ANALYTICS.visitorStats }).pipe(delay(300));
  }

  getGeographic(_start = '7daysAgo', _end = 'today'): Observable<any> {
    return of({ data: MOCK_ANALYTICS.geographic }).pipe(delay(300));
  }

  getDevices(_start = '7daysAgo', _end = 'today'): Observable<any> {
    return of({ data: MOCK_ANALYTICS.devices }).pipe(delay(300));
  }

  getTraffic(_start = '7daysAgo', _end = 'today'): Observable<any> {
    return of({ data: MOCK_ANALYTICS.traffic }).pipe(delay(300));
  }

  getTopPages(_start = '7daysAgo', _end = 'today'): Observable<any> {
    return of({ data: MOCK_ANALYTICS.topPages }).pipe(delay(300));
  }
}
