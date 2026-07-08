import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { CardBase } from "@ui/base/card.base";

@Component({
  selector: "app-card",
  standalone: true,
  template: `
    <section class="app-card" [class.app-card-elevated]="elevated()">
      @if (header() || subheader()) {
        <header class="app-card-header">
          @if (header()) {
            <div class="app-card-title">{{ header() }}</div>
          }
          @if (subheader()) {
            <div class="app-card-subtitle">{{ subheader() }}</div>
          }
        </header>
      }
      <div class="app-card-body" [class.app-card-body-unpadded]="!padded()">
        <ng-content />
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    .app-card {
      display: block;
      background: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border, #d7dbe3);
      border-radius: var(--ds-radius-lg, 12px);
      overflow: hidden;
    }
    .app-card-elevated {
      box-shadow: var(--ds-shadow-sm, 0 4px 16px rgba(15, 23, 42, 0.08));
    }
    .app-card-header {
      padding: 1rem 1rem 0;
    }
    .app-card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--ds-text-primary, #1f2937);
      line-height: 1.3;
    }
    .app-card-subtitle {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: var(--ds-text-secondary, #4d5562);
      line-height: 1.4;
    }
    .app-card-body {
      padding: 1rem;
    }
    .app-card-body-unpadded {
      padding: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppCard extends CardBase {}
