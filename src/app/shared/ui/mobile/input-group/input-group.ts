import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { InputGroupBase } from "@ui/base/input-group.base";

@Component({
  selector: "ili-input-group",

  imports: [],
  template: `
    <div class="ili-input-group">
      @if (addonBefore()) {
        <span class="ili-input-group-addon ili-input-group-addon-before">{{
          addonBefore()
        }}</span>
      }
      <div class="ili-input-group-content">
        <ng-content />
      </div>
      @if (addonAfter()) {
        <span class="ili-input-group-addon ili-input-group-addon-after">{{
          addonAfter()
        }}</span>
      }
    </div>
  `,
  styles: [
    `
      .ili-input-group {
        display: flex;
        align-items: stretch;
        width: 100%;
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 8px);
        overflow: hidden;
        background: var(--ds-bg-input, #ffffff);
      }
      .ili-input-group-addon {
        display: flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        font-size: var(--ds-font-size-body, 0.9375rem);
        color: var(--ds-text-secondary, #64748b);
        background: var(--ds-bg-elevated, #f8fafc);
        white-space: nowrap;
      }
      .ili-input-group-addon-before {
        border-right: 1px solid var(--ds-border, #e2e8f0);
      }
      .ili-input-group-addon-after {
        border-left: 1px solid var(--ds-border, #e2e8f0);
      }
      .ili-input-group-content {
        flex: 1;
        display: flex;
      }
      .ili-input-group-content > * {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MobileInputGroup extends InputGroupBase {}
