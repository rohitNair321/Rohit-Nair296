import {
  Component,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChatApiService } from 'src/app/core/services/chat-api.service';

// ── API response types ────────────────────────────────────────

interface UsageSummary {
  totalTokens:  number;
  inputTokens:  number;
  outputTokens: number;
}

interface UsageTrend {
  date:   string;   // 'YYYY-MM-DD'
  tokens: number;
}

interface UsageResponse {
  summary: UsageSummary;
  trend:   UsageTrend[];
}

// ── Pricing constants — GPT-4o (per 1 000 tokens) ────────────
// Update these when OpenAI changes pricing.
const INPUT_COST_PER_1K  = 0.005;   // $0.005 per 1K input tokens
const OUTPUT_COST_PER_1K = 0.015;   // $0.015 per 1K output tokens

// ── Rate card rows shown in the UI ───────────────────────────
interface RateRow {
  type:      string;
  desc:      string;
  price:     string;
  highlight: boolean;
}

// ── Time range option ─────────────────────────────────────────
interface RangeOption {
  label: string;
  value: string;
}

@Component({
  selector:     'app-ai-usage-dashboard',
  standalone:   true,
  imports:      [CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl:  './ai-usage-dashboard.component.html',
  styleUrls:   ['./ai-usage-dashboard.component.scss'],
})
export class AiUsageDashboardComponent implements OnInit {

  // ── State signals ─────────────────────────────────────────────
  summary       = signal<UsageSummary | null>(null);
  trend         = signal<UsageTrend[]>([]);
  loading       = signal(false);
  hasError      = signal(false);
  selectedRange = signal('7d');

  // ── Static config ─────────────────────────────────────────────
  readonly ranges: RangeOption[] = [
    { label: '7D',  value: '7d'  },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
  ];

  readonly rateCard: RateRow[] = [
    {
      type:      'Input',
      desc:      'Prompt tokens sent to model',
      price:     '$0.005',
      highlight: false,
    },
    {
      type:      'Output',
      desc:      'Completion tokens generated',
      price:     '$0.015',
      highlight: true,
    },
    {
      type:      'Cached',
      desc:      'Prompt cache hit',
      price:     '$0.0025',
      highlight: false,
    },
  ];

  // ── Cost computed signals ─────────────────────────────────────

  /** Cost of input tokens in USD. */
  inputCost = computed<number>(() => {
    const s = this.summary();
    if (!s) { return 0; }
    return (s.inputTokens / 1000) * INPUT_COST_PER_1K;
  });

  /** Cost of output tokens in USD. */
  outputCost = computed<number>(() => {
    const s = this.summary();
    if (!s) { return 0; }
    return (s.outputTokens / 1000) * OUTPUT_COST_PER_1K;
  });

  /** Total estimated cost in USD. */
  totalCost = computed<number>(() => this.inputCost() + this.outputCost());

  // ── Distribution computed signals ────────────────────────────

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

  /**
   * Output / Input ratio.
   * < 0.1  → very concise  (model replies are terse)
   * 0.1–0.3→ balanced
   * > 0.3  → verbose       (model generates a lot relative to prompts)
   */
  efficiencyRatio = computed<number>(() => {
    const s = this.summary();
    if (!s || s.inputTokens === 0) { return 0; }
    return s.outputTokens / s.inputTokens;
  });

  // ── Trend computed helpers ────────────────────────────────────

  private trendMax = computed<number>(() =>
    Math.max(...this.trend().map(t => t.tokens), 1)
  );

  /** Returns the bar height percentage (0–100) for a given token count. */
  barHeight(tokens: number): number {
    const max = this.trendMax();
    return max ? Math.max(4, (tokens / max) * 100) : 4;
  }

  /**
   * Estimated cost for a single day's token count.
   * Uses the blended cost rate (assumes same input/output split as summary).
   */
  dayCost(tokens: number): number {
    const s = this.summary();
    if (!s || s.totalTokens === 0) {
      return (tokens / 1000) * INPUT_COST_PER_1K;
    }
    const inputShare  = s.inputTokens  / s.totalTokens;
    const outputShare = s.outputTokens / s.totalTokens;
    const blendedRate = inputShare  * INPUT_COST_PER_1K
                      + outputShare * OUTPUT_COST_PER_1K;
    return (tokens / 1000) * blendedRate;
  }

  // ── Date formatting ───────────────────────────────────────────

  /** 'YYYY-MM-DD' → 'Apr 2' */
  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // ── Lifecycle ─────────────────────────────────────────────────

  constructor(private api: ChatApiService) {}

  ngOnInit(): void {
    this.loadUsage();
  }

  // ── Data loading ──────────────────────────────────────────────

  loadUsage(): void {
    this.loading.set(true);
    this.hasError.set(false);

    this.api.getUsage({ range: this.selectedRange() }).subscribe({
      next: (res: UsageResponse) => {
        this.summary.set(res.summary);
        this.trend.set(res.trend ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }

  changeRange(range: string): void {
    this.selectedRange.set(range);
    this.loadUsage();
  }
}