import {
  Component,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { AllTimeBlock, BalanceResponse, ChatApiService, ModelBreakdown, RoleBlock, SessionSummary, UsageResponse, UsageSummary, UsageTrend } from 'src/app/core/services/chat-api.service';

// ══════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ══════════════════════════════════════════════════════════════

// ── Pricing table (per 1 000 tokens) — mirrors aiService.js ──
const PRICING: Record<string, { input: number; output: number }> = {
  'o4-mini': { input: 0.003, output: 0.012 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
};
const DEFAULT_RATE = { input: 0.003, output: 0.012 };
function getRate(model: string) { return PRICING[model] ?? DEFAULT_RATE; }

interface RangeOption { label: string; value: string; }
interface RateRow { model: string; inputRate: string; outputRate: string; highlight: boolean; }
type Tab = 'overview' | 'history' | 'sessions';

@Component({
  selector: 'app-ai-usage-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './ai-usage-dashboard.component.html',
  styleUrls: ['./ai-usage-dashboard.component.scss'],
})
export class AiUsageDashboardComponent implements OnInit {

  // ── Signals ───────────────────────────────────────────────────
  summary = signal<UsageSummary | null>(null);
  trend = signal<UsageTrend[]>([]);
  byModel = signal<ModelBreakdown[]>([]);
  byRole = signal<{ admin: RoleBlock; guest: RoleBlock } | null>(null);
  sessions = signal<SessionSummary[]>([]);
  allTime = signal<AllTimeBlock | null>(null);
  balance = signal<BalanceResponse | null>(null);
  loading = signal(false);
  balanceLoading = signal(false);
  hasError = signal(false);
  selectedRange = signal('7d');
  activeTab = signal<Tab>('overview');

  // ── Static config ─────────────────────────────────────────────
  readonly ranges: RangeOption[] = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: 'All', value: 'all' },
  ];

  readonly rateCard: RateRow[] = [
    { model: 'o4-mini', inputRate: '$0.003', outputRate: '$0.012', highlight: true },
    { model: 'gpt-4o', inputRate: '$0.005', outputRate: '$0.015', highlight: false },
    { model: 'gpt-4o-mini', inputRate: '$0.00015', outputRate: '$0.0006', highlight: false },
    { model: 'gpt-4-turbo', inputRate: '$0.010', outputRate: '$0.030', highlight: false },
    { model: 'gpt-3.5-turbo', inputRate: '$0.0005', outputRate: '$0.0015', highlight: false },
  ];

  readonly tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'history', label: 'History', icon: 'history' },
    { id: 'sessions', label: 'Sessions', icon: 'list_alt' },
  ];

  // ── Computed ──────────────────────────────────────────────────
  inputPct = computed<number>(() => {
    const s = this.summary();
    if (!s || s.totalTokens === 0) { return 0; }
    return Math.round((s.inputTokens / s.totalTokens) * 100);
  });

  outputPct = computed<number>(() => {
    const s = this.summary();
    if (!s || s.totalTokens === 0) { return 0; }
    return Math.round((s.outputTokens / s.totalTokens) * 100);
  });

  efficiencyRatio = computed<number>(() => {
    const s = this.summary();
    if (!s || s.inputTokens === 0) { return 0; }
    return s.outputTokens / s.inputTokens;
  });

  totalCost = computed<number>(() => this.summary()?.totalCost ?? 0);

  inputCost = computed<number>(() => {
    const s = this.summary();
    if (!s) { return 0; }
    const rate = getRate(this.byModel()[0]?.model ?? 'o4-mini');
    return (s.inputTokens / 1000) * rate.input;
  });

  outputCost = computed<number>(() => {
    const s = this.summary();
    if (!s) { return 0; }
    const rate = getRate(this.byModel()[0]?.model ?? 'o4-mini');
    return (s.outputTokens / 1000) * rate.output;
  });

  topModel = computed<ModelBreakdown | null>(() => this.byModel()[0] ?? null);

  guestTokenPct = computed<number>(() => {
    const r = this.byRole();
    if (!r) { return 0; }
    const total = r.admin.totalTokens + r.guest.totalTokens;
    return total ? Math.round((r.guest.totalTokens / total) * 100) : 0;
  });

  adminTokenPct = computed<number>(() => 100 - this.guestTokenPct());

  allTimeCostFormatted = computed<string>(() => {
    const a = this.allTime();
    return a ? `$${a.totalCost.toFixed(4)}` : '$0.0000';
  });

  // ── Trend helpers ─────────────────────────────────────────────
  private trendMax = computed<number>(() =>
    Math.max(...this.trend().map(t => t.tokens), 1)
  );

  barHeight(tokens: number): number {
    return Math.max(4, (tokens / this.trendMax()) * 100);
  }

  // ── Date formatting ───────────────────────────────────────────
  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatDateLong(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  shortId(id: string): string {
    return id.length > 12 ? id.slice(0, 6) + '…' + id.slice(-4) : id;
  }

  efficiencyLabel(ratio: number): string {
    if (ratio < 0.1) { return 'very concise'; }
    if (ratio < 0.3) { return 'balanced'; }
    return 'verbose';
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  constructor(private api: ChatApiService) { }

  ngOnInit(): void {
    this.loadUsage();
    this.loadBalance();
  }

  loadUsage(): void {
    this.loading.set(true);
    this.hasError.set(false);

    this.api.getUsage({ range: this.selectedRange() }).subscribe({
      next: (res: UsageResponse) => {
        this.summary.set(res.summary);
        this.trend.set(res.trend ?? []);
        this.byModel.set(res.byModel ?? []);
        this.byRole.set(res.byRole ?? null);
        this.sessions.set(res.sessions ?? []);
        this.allTime.set(res.allTime ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }

  loadBalance(): void {
    this.balanceLoading.set(true);
    // Requires ChatApiService.getBalance(): Observable<BalanceResponse>
    // pointing to GET /api/ai/balance
    (this.api as any).getBalance?.()?.subscribe({
      next: (res: BalanceResponse) => {
        this.balance.set(res);
        this.balanceLoading.set(false);
      },
      error: () => this.balanceLoading.set(false),
    });
  }

  changeRange(range: string): void {
    this.selectedRange.set(range);
    this.loadUsage();
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }
}