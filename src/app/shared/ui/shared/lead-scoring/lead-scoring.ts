import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";

export interface LeadScoreCategory {
  label: string;
  score: number;
  maxScore: number;
  color?: string;
}

@Component({
  selector: "app-lead-scoring",

  imports: [],
  template: `
    <div class="lead-scoring-root">
      <div class="lead-scoring-total">
        <span class="lead-scoring-total-label">Score total</span>
        <strong class="lead-scoring-total-value"
          >{{ totalScore }}/{{ totalMax }}</strong
        >
        <div class="lead-scoring-total-bar">
          <div
            class="lead-scoring-total-fill"
            [style.width.%]="totalPercent"
            [style.background]="totalColor()"
          ></div>
        </div>
      </div>
      @for (cat of categories(); track cat.label) {
        <div class="lead-scoring-category">
          <div class="lead-scoring-category-header">
            <span class="lead-scoring-category-label">{{ cat.label }}</span>
            <span class="lead-scoring-category-score"
              >{{ cat.score }}/{{ cat.maxScore }}</span
            >
          </div>
          <div class="lead-scoring-bar">
            <div
              class="lead-scoring-bar-fill"
              [style.width.%]="(cat.score / cat.maxScore) * 100"
              [style.background]="cat.color || 'var(--ds-primary)'"
            ></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .lead-scoring-root {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: var(--ds-bg-surface, #ffffff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-lg, 8px);
        padding: 1rem;
      }
      .lead-scoring-total {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }
      .lead-scoring-total-label {
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .lead-scoring-total-value {
        font-size: var(--ds-font-size-metric, 1.5rem);
        color: var(--ds-text-primary);
      }
      .lead-scoring-total-bar {
        height: 8px;
        background: var(--ds-bg-elevated, #f4f5f8);
        border-radius: var(--ds-radius-pill, 999px);
        overflow: hidden;
      }
      .lead-scoring-total-fill {
        height: 100%;
        border-radius: var(--ds-radius-pill, 999px);
        transition: width 0.4s ease;
      }
      .lead-scoring-category-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
      }
      .lead-scoring-category-label {
        font-size: var(--ds-font-size-table, 0.875rem);
        color: var(--ds-text-primary);
      }
      .lead-scoring-category-score {
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-text-muted);
      }
      .lead-scoring-bar {
        height: 6px;
        background: var(--ds-bg-elevated, #f4f5f8);
        border-radius: var(--ds-radius-pill, 999px);
        overflow: hidden;
      }
      .lead-scoring-bar-fill {
        height: 100%;
        border-radius: var(--ds-radius-pill, 999px);
        transition: width 0.4s ease;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class LeadScoring {
  categories = input.required<LeadScoreCategory[]>();

  totalScore = computed(() =>
    this.categories().reduce((s, c) => s + c.score, 0),
  );
  totalMax = computed(() =>
    this.categories().reduce((s, c) => s + c.maxScore, 0),
  );
  totalPercent = computed(() => {
    const max = this.totalMax();
    return max ? Math.round((this.totalScore() / max) * 100) : 0;
  });

  totalColor = computed(() => {
    const pct = this.totalPercent();
    if (pct < 33) return "var(--ds-danger, #ba1a1a)";
    if (pct < 66) return "var(--ds-warning, #f5a623)";
    return "var(--ds-success, #006837)";
  });
}
