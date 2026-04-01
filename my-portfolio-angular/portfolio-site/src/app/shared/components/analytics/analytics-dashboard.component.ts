import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  signal,
  computed,
  effect,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { AnalyticsDashboard, AnalyticsService } from '../../services/analytics.service';

Chart.register(...registerables);

// ── Time range option type ────────────────────────────────────
interface TimeRangeOption {
  label: string;
  value: '7days' | '30days' | 'custom';
}

// ── Helper: read a CSS custom property from :root ─────────────
// Used so Chart.js datasets always reflect the active theme token,
// even after a runtime theme switch.
function cssVar(name: string, fallback = '#888'): string {
  if (typeof document === 'undefined') { return fallback; }
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name).trim() || fallback;
}

// ── Helper: derive an rgba string from a CSS var hex value ────
function cssVarAlpha(name: string, alpha: number, fallback = '#888'): string {
  const hex = cssVar(name, fallback).replace('#', '');
  const r   = parseInt(hex.substring(0, 2), 16);
  const g   = parseInt(hex.substring(2, 4), 16);
  const b   = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    TooltipModule,
  ],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss'],
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── Canvas refs ───────────────────────────────────────────────
  @ViewChild('pageViewsChart') pageViewsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('devicesChart')   devicesChartRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart')   trafficChartRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('geoChart')       geoChartRef!:       ElementRef<HTMLCanvasElement>;

  // ── Chart instances ───────────────────────────────────────────
  private _pageViewsChart: Chart | null = null;
  private _devicesChart:   Chart | null = null;
  private _trafficChart:   Chart | null = null;
  private _geoChart:       Chart | null = null;

  // ── UI signals ────────────────────────────────────────────────
  selectedTimeRange = signal<'7days' | '30days' | 'custom'>('7days');
  customDateRange: Date[] | null = null;    // ngModel for p-calendar (not a signal — PrimeNG two-way)

  // ── Time range options (drives the pill buttons in the template) ──
  readonly timeRangeOptions: TimeRangeOption[] = [
    { label: '7 Days',  value: '7days'  },
    { label: '30 Days', value: '30days' },
    { label: 'Custom',  value: 'custom' },
  ];

  // ── Data from service ─────────────────────────────────────────
  dashboardData = computed(() => this.analyticsService.dashboardData());
  loading       = computed(() => this.analyticsService.loading());
  error         = computed(() => this.analyticsService.error());

  // ── Computed metrics ──────────────────────────────────────────
  totalPageViews = computed(() =>
    this.dashboardData()?.pageViews.reduce((s, pv) => s + pv.pageViews, 0) ?? 0
  );

  totalSessions = computed(() =>
    this.dashboardData()?.pageViews.reduce((s, pv) => s + pv.sessions, 0) ?? 0
  );

  /** Percentage of new users vs total — drives the metric card bar. */
  newUserPercent = computed(() => {
    const d = this.dashboardData()?.visitorStats;
    if (!d?.totalUsers) { return 0; }
    return Math.min(100, (d.newUsers / d.totalUsers) * 100);
  });

  /** Max page views across all top pages — used to compute share bars. */
  private _maxPageViews = computed(() => {
    const pages = this.dashboardData()?.topPages ?? [];
    return pages.reduce((m, p) => Math.max(m, p.pageViews), 1);
  });

  /** Percentage share of a given page's views relative to the top page. */
  pageShare(views: number): number {
    return (views / this._maxPageViews()) * 100;
  }

  // ── Subscriptions ─────────────────────────────────────────────
  private _sub = new Subscription();
  private _chartsReady = false;

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef,
  ) {
    // Re-render charts whenever the service pushes new data.
    // The guard prevents chart updates before ViewChild refs are set.
    effect(() => {
      const data = this.dashboardData();
      if (data && this._chartsReady) {
        // Defer one microtask so the @if block has time to stamp
        // the canvas elements into the DOM.
        setTimeout(() => this._updateAllCharts(), 100);
      }
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadAnalytics();
  }

  ngAfterViewInit(): void {
    this._chartsReady = true;
    // If data already arrived before the view initialised, draw now.
    if (this.dashboardData()) {
      setTimeout(() => this._updateAllCharts(), 100);
    }
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
    this._destroyCharts();
  }

  // ── Public methods (called from template) ─────────────────────

  loadAnalytics(): void {
    const range = this.selectedTimeRange();
    let startDate = '7daysAgo';
    let endDate   = 'today';

    if (range === '30days') {
      startDate = '30daysAgo';
    } else if (range === 'custom' && this.customDateRange?.length) {
      startDate = this._formatDate(this.customDateRange[0]);
      endDate   = this._formatDate(this.customDateRange[1] ?? this.customDateRange[0]);
    }

    const sub = this.analyticsService.getDashboard(startDate, endDate).subscribe();
    this._sub.add(sub);
  }

  changeTimeRange(range: '7days' | '30days' | 'custom'): void {
    this.selectedTimeRange.set(range);
    if (range !== 'custom') { this.loadAnalytics(); }
  }

  applyCustomRange(): void {
    if (this.customDateRange?.length) { this.loadAnalytics(); }
  }

  refresh(): void {
    this.loadAnalytics();
  }

  // ── Format helpers (public — used in template) ────────────────

  formatNumber(n: number): string {
    return n.toLocaleString();
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  formatDuration(seconds: number): string {
    if (seconds < 60) { return `${Math.round(seconds)}s`; }
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
  }

  // ── Private: chart rendering ──────────────────────────────────

  private _updateAllCharts(): void {
    const data = this.dashboardData();
    if (!data) { return; }

    this._renderPageViewsChart(data);
    this._renderDevicesChart(data);
    this._renderTrafficChart(data);
    this._renderGeoChart(data);
  }

  private _destroyCharts(): void {
    this._pageViewsChart?.destroy();
    this._devicesChart?.destroy();
    this._trafficChart?.destroy();
    this._geoChart?.destroy();
    this._pageViewsChart = null;
    this._devicesChart   = null;
    this._trafficChart   = null;
    this._geoChart       = null;
  }

  // ── Shared Chart.js defaults (token-aware) ────────────────────
  private _sharedOptions(overrides: Partial<ChartConfiguration['options']> = {}): ChartConfiguration['options'] {
    const textMuted  = cssVar('--text-muted',      '#888');
    const border     = cssVar('--border',           '#ddd');
    const textSecond = cssVar('--text-secondary',   '#666');

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textSecond,
            font: { size: 12 },
            boxWidth: 10,
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: cssVar('--surface'),
          titleColor:      cssVar('--text-primary'),
          bodyColor:       textSecond,
          borderColor:     border,
          borderWidth:     1,
          padding:         10,
          cornerRadius:    8,
          mode:            'index',
          intersect:       false,
        },
      },
      scales: {
        x: {
          ticks: { color: textMuted, font: { size: 11 } },
          grid:  { color: border, drawBorder: false } as any,
        },
        y: {
          ticks:      { color: textMuted, font: { size: 11 }, precision: 0 },
          grid:       { color: border, drawBorder: false } as any,
          beginAtZero: true,
        },
      },
      ...overrides,
    };
  }

  // ── Page Views + Sessions line chart ─────────────────────────
  private _renderPageViewsChart(data: AnalyticsDashboard): void {
    this._pageViewsChart?.destroy();
    const ctx = this.pageViewsChartRef?.nativeElement.getContext('2d');
    if (!ctx) { return; }

    const primary = cssVar('--primary');
    const accent  = cssVar('--accent');

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.pageViews.map(pv => this._formatChartDate(pv.date)),
        datasets: [
          {
            label: 'Page Views',
            data: data.pageViews.map(pv => pv.pageViews),
            borderColor:     primary,
            backgroundColor: cssVarAlpha('--primary', 0.08),
            tension: 0.45,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: primary,
          },
          {
            label: 'Sessions',
            data: data.pageViews.map(pv => pv.sessions),
            borderColor:     accent,
            backgroundColor: cssVarAlpha('--accent', 0.07),
            tension: 0.45,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: accent,
          },
        ],
      },
      options: this._sharedOptions({
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { mode: 'index', intersect: false },
        } as any,
      }),
    };

    this._pageViewsChart = new Chart(ctx, config);
  }

  // ── Devices doughnut ─────────────────────────────────────────
  private _renderDevicesChart(data: AnalyticsDashboard): void {
    this._devicesChart?.destroy();
    const ctx = this.devicesChartRef?.nativeElement.getContext('2d');
    if (!ctx) { return; }

    const deviceMap = new Map<string, number>();
    data.devices.forEach(d => deviceMap.set(d.device, (deviceMap.get(d.device) ?? 0) + d.users));

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels:   Array.from(deviceMap.keys()),
        datasets: [{
          data:            Array.from(deviceMap.values()),
          backgroundColor: [
            cssVar('--primary'),
            cssVar('--accent'),
            cssVarAlpha('--primary', 0.45),
          ],
          borderColor:  cssVar('--surface'),
          borderWidth:  3,
          hoverOffset:  6,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels:   {
              color:    cssVar('--text-secondary'),
              font:     { size: 12 },
              boxWidth: 10,
              padding:  12,
            },
          },
          tooltip: {
            backgroundColor: cssVar('--surface'),
            titleColor:      cssVar('--text-primary'),
            bodyColor:       cssVar('--text-secondary'),
            borderColor:     cssVar('--border'),
            borderWidth:     1,
            cornerRadius:    8,
          },
        },
      },
    };

    this._devicesChart = new Chart(ctx, config);
  }

  // ── Traffic sources bar ───────────────────────────────────────
  private _renderTrafficChart(data: AnalyticsDashboard): void {
    this._trafficChart?.destroy();
    const ctx = this.trafficChartRef?.nativeElement.getContext('2d');
    if (!ctx) { return; }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels:   data.traffic.map(t => t.source),
        datasets: [{
          label:           'Sessions',
          data:            data.traffic.map(t => t.sessions),
          backgroundColor: cssVarAlpha('--primary', 0.75),
          borderColor:     cssVar('--primary'),
          borderWidth:     1,
          borderRadius:    6,
        }],
      },
      options: this._sharedOptions({
        plugins: { legend: { display: false } } as any,
      }),
    };

    this._trafficChart = new Chart(ctx, config);
  }

  // ── Geographic horizontal bar ─────────────────────────────────
  private _renderGeoChart(data: AnalyticsDashboard): void {
    this._geoChart?.destroy();
    const ctx = this.geoChartRef?.nativeElement.getContext('2d');
    if (!ctx) { return; }

    const top10 = data.geographic.slice(0, 10);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels:   top10.map(g => g.country),
        datasets: [{
          label:           'Users',
          data:            top10.map(g => g.users),
          backgroundColor: cssVarAlpha('--accent', 0.75),
          borderColor:     cssVar('--accent'),
          borderWidth:     1,
          borderRadius:    5,
        }],
      },
      options: {
        ...this._sharedOptions({ plugins: { legend: { display: false } } as any }),
        indexAxis: 'y',
        scales: {
          x: {
            ticks:       { color: cssVar('--text-muted'), font: { size: 11 }, precision: 0 },
            grid:        { color: cssVar('--border'), drawBorder: false } as any,
            beginAtZero: true,
          },
          y: {
            ticks: { color: cssVar('--text-muted'), font: { size: 11 } },
            grid:  { display: false } as any,
          },
        },
      },
    };

    this._geoChart = new Chart(ctx, config);
  }

  // ── Private date helpers ──────────────────────────────────────

  /** '20260325' → 'Mar 25' */
  private _formatChartDate(d: string): string {
    const dt = new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  /** Date → 'YYYY-MM-DD' for the API */
  private _formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}