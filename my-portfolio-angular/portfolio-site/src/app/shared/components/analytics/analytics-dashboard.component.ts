// shared/components/analytics/analytics.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal, computed, effect } from '@angular/core';
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

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, CalendarModule, TooltipModule],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  @ViewChild('pageViewsChart') pageViewsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('devicesChart') devicesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart') trafficChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('geoChart') geoChartRef!: ElementRef<HTMLCanvasElement>;

  // Charts
  private pageViewsChart: Chart | null = null;
  private devicesChart: Chart | null = null;
  private trafficChart: Chart | null = null;
  private geoChart: Chart | null = null;

  // State
  selectedTimeRange = signal<'7days' | '30days' | 'custom'>('7days');
  customDateRange = signal<Date[] | null>(null);
  
  // Data from service
  dashboardData = computed(() => this.analyticsService.dashboardData());
  loading = computed(() => this.analyticsService.loading());
  error = computed(() => this.analyticsService.error());

  // Computed stats
  totalPageViews = computed(() => {
    const data = this.dashboardData();
    return data?.pageViews.reduce((sum, pv) => sum + pv.pageViews, 0) || 0;
  });

  totalSessions = computed(() => {
    const data = this.dashboardData();
    return data?.pageViews.reduce((sum, pv) => sum + pv.sessions, 0) || 0;
  });

  private subscription = new Subscription();

  constructor(private analyticsService: AnalyticsService) {
    // Auto-update charts when data changes
    effect(() => {
      const data = this.dashboardData();
      if (data) {
        setTimeout(() => this.updateAllCharts(), 100);
      }
    });
  }

  ngOnInit() {
    this.loadAnalytics();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroyCharts();
  }

  /**
   * Load analytics data
   */
  loadAnalytics() {
    const range = this.selectedTimeRange();
    let startDate = '7daysAgo';
    let endDate = 'today';

    if (range === '30days') {
      startDate = '30daysAgo';
    } else if (range === 'custom' && this.customDateRange()) {
      const dates = this.customDateRange()!;
      startDate = this.formatDate(dates[0]);
      endDate = this.formatDate(dates[1] || dates[0]);
    }

    const sub = this.analyticsService.getDashboard(startDate, endDate).subscribe();
    this.subscription.add(sub);
  }

  /**
   * Change time range
   */
  changeTimeRange(range: '7days' | '30days' | 'custom') {
    this.selectedTimeRange.set(range);
    if (range !== 'custom') {
      this.loadAnalytics();
    }
  }

  /**
   * Apply custom date range
   */
  applyCustomRange() {
    if (this.customDateRange()) {
      this.loadAnalytics();
    }
  }

  /**
   * Refresh data
   */
  refresh() {
    this.loadAnalytics();
  }

  /**
   * Update all charts
   */
  private updateAllCharts() {
    const data = this.dashboardData();
    if (!data) return;

    this.updatePageViewsChart(data);
    this.updateDevicesChart(data);
    this.updateTrafficChart(data);
    this.updateGeoChart(data);
  }

  /**
   * Page Views Line Chart
   */
  private updatePageViewsChart(data: AnalyticsDashboard) {
    if (this.pageViewsChart) {
      this.pageViewsChart.destroy();
    }

    if (!this.pageViewsChartRef) return;

    const ctx = this.pageViewsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = data.pageViews.map(pv => this.formatChartDate(pv.date));
    const pageViewsData = data.pageViews.map(pv => pv.pageViews);
    const sessionsData = data.pageViews.map(pv => pv.sessions);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Page Views',
            data: pageViewsData,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Sessions',
            data: sessionsData,
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    };

    this.pageViewsChart = new Chart(ctx, config);
  }

  /**
   * Devices Pie Chart
   */
  private updateDevicesChart(data: AnalyticsDashboard) {
    if (this.devicesChart) {
      this.devicesChart.destroy();
    }

    if (!this.devicesChartRef) return;

    const ctx = this.devicesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Aggregate by device type
    const deviceMap = new Map<string, number>();
    data.devices.forEach(d => {
      const current = deviceMap.get(d.device) || 0;
      deviceMap.set(d.device, current + d.users);
    });

    const labels = Array.from(deviceMap.keys());
    const values = Array.from(deviceMap.values());

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [
            'rgb(99, 102, 241)',
            'rgb(139, 92, 246)',
            'rgb(236, 72, 153)',
          ],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    };

    this.devicesChart = new Chart(ctx, config);
  }

  /**
   * Traffic Sources Bar Chart
   */
  private updateTrafficChart(data: AnalyticsDashboard) {
    if (this.trafficChart) {
      this.trafficChart.destroy();
    }

    if (!this.trafficChartRef) return;

    const ctx = this.trafficChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = data.traffic.map(t => t.source);
    const sessions = data.traffic.map(t => t.sessions);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sessions',
          data: sessions,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    };

    this.trafficChart = new Chart(ctx, config);
  }

  /**
   * Geographic Bar Chart
   */
  private updateGeoChart(data: AnalyticsDashboard) {
    if (this.geoChart) {
      this.geoChart.destroy();
    }

    if (!this.geoChartRef) return;

    const ctx = this.geoChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Top 10 countries
    const top10 = data.geographic.slice(0, 10);
    const labels = top10.map(g => g.country);
    const users = top10.map(g => g.users);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Users',
          data: users,
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    };

    this.geoChart = new Chart(ctx, config);
  }

  /**
   * Destroy all charts
   */
  private destroyCharts() {
    this.pageViewsChart?.destroy();
    this.devicesChart?.destroy();
    this.trafficChart?.destroy();
    this.geoChart?.destroy();
  }

  /**
   * Format date for chart labels
   */
  private formatChartDate(dateStr: string): string {
    // Format: 20260325 → Mar 25
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  /**
   * Format date for API
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format duration (seconds to readable)
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  }

  /**
   * Format percentage
   */
  formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  /**
   * Format number with commas
   */
  formatNumber(num: number): string {
    return num.toLocaleString();
  }

}
