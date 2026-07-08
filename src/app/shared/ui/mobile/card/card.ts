import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { CardBase } from "@ui/base/card.base";

@Component({
  selector: "ili-card",
  standalone: true,
  template: `
    <section class="ili-card" [class.ili-card-elevated]="elevated()">
      @if (header() || subheader()) {
        <header class="ili-card-header">
          @if (header()) {
            <div class="ili-card-title">{{ header() }}</div>
          }
          @if (subheader()) {
            <div class="ili-card-subtitle">{{ subheader() }}</div>
          }
        </header>
      }
      <div class="ili-card-body" [class.ili-card-body-unpadded]="!padded()">
        <ng-content />
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    .ili-card {
      display: block;
      background: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border, #d7dbe3);
      border-radius: var(--ds-radius-lg, 12px);
      overflow: hidden;
    }
    .ili-card-elevated {
      box-shadow: var(--ds-shadow-sm, 0 4px 16px rgba(15, 23, 42, 0.08));
    }
    .ili-card-header {
      padding: 0.9rem 0.9rem 0;
    }
    .ili-card-title {
      font-size: 0.98rem;
      font-weight: 700;
      color: var(--ds-text-primary, #1f2937);
      line-height: 1.3;
    }
    .ili-card-subtitle {
      margin-top: 0.25rem;
      font-size: 0.8125rem;
      color: var(--ds-text-secondary, #4d5562);
      line-height: 1.4;
    }
    .ili-card-body {
      padding: 0.9rem;
    }
    .ili-card-body-unpadded {
      padding: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileCard extends CardBase {}
