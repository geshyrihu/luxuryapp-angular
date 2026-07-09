import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { DividerBase } from "@ui/base/divider.base";

@Component({
  selector: "ili-divider",

  template: `
    <div
      class="ili-divider"
      [class.ili-divider-vertical]="layout() === 'vertical'"
      role="separator"
    >
      @if (layout() !== "vertical") {
        <span class="ili-divider-content"><ng-content /></span>
      } @else {
        <ng-content />
      }
    </div>
  `,
  styles: [
    `
      .ili-divider {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 0.5rem 0;
      }
      .ili-divider::before,
      .ili-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--ds-border, #d7dbe3);
      }
      .ili-divider-content {
        padding: 0 0.5rem;
      }
      .ili-divider-vertical {
        flex-direction: column;
        width: 1px;
        height: 100%;
        margin: 0 0.5rem;
      }
      .ili-divider-vertical::before,
      .ili-divider-vertical::after {
        width: 1px;
        flex: 1;
        background: var(--ds-border, #d7dbe3);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliDivider extends DividerBase {}
