import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { DividerBase } from "@ui/base/divider.base";

@Component({
  selector: "app-divider",

  template: `
    <div
      class="app-divider"
      [class.app-divider-vertical]="layout() === 'vertical'"
      role="separator"
    >
      @if (layout() !== "vertical") {
        <span class="app-divider-content"><ng-content /></span>
      } @else {
        <ng-content />
      }
    </div>
  `,
  styles: [
    `
      .app-divider {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 0.5rem 0;
      }
      .app-divider::before,
      .app-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--ds-border, #d7dbe3);
      }
      .app-divider-content {
        padding: 0 0.5rem;
      }
      .app-divider-vertical {
        flex-direction: column;
        width: 1px;
        height: 100%;
        margin: 0 0.5rem;
      }
      .app-divider-vertical::before,
      .app-divider-vertical::after {
        width: 1px;
        flex: 1;
        background: var(--ds-border, #d7dbe3);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppDivider extends DividerBase {}
