import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { PanelBase } from "@ui/core/panel.base";

@Component({
  selector: "lux-panel-mobile",
  template: `
    <div class="lux-panel-mobile">
      @if (header()) {
        <div class="lux-panel-mobile-header">{{ header() }}</div>
      }
      <div class="lux-panel-mobile-content">
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      .lux-panel-mobile {
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        overflow: hidden;
      }
      .lux-panel-mobile-header {
        padding: 0.75rem 1rem;
        font-weight: 700;
        font-size: 1rem;
        background: var(--ds-bg-sunken);
        border-bottom: 1px solid var(--ds-border);
      }
      .lux-panel-mobile-content {
        padding: 1rem;
      }
    `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliPanel extends PanelBase {}
