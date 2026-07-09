import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { PanelBase } from "@ui/base/panel.base";

@Component({
  selector: "ili-panel",

  template: `
    <div class="ili-panel">
      @if (header()) {
        <div class="ili-panel-header">{{ header() }}</div>
      }
      <div class="ili-panel-content">
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      .ili-panel {
        border: 1px solid var(--ds-border, #d7dbe3);
        border-radius: var(--ds-radius-md, 8px);
        overflow: hidden;
      }
      .ili-panel-header {
        padding: 0.75rem 1rem;
        font-weight: 700;
        font-size: 1rem;
        background: var(--ds-bg-sunken, #f4f5f8);
        border-bottom: 1px solid var(--ds-border, #d7dbe3);
      }
      .ili-panel-content {
        padding: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliPanel extends PanelBase {}
