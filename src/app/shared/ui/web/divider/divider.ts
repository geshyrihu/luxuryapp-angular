import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { DividerBase } from "@ui/base/divider.base";

@Component({
  selector: "app-divider",
  standalone: true,
  template: `
    <div
      class="app-divider"
      [class.app-divider-vertical]="layout() === 'vertical'"
      role="separator"
    ></div>
  `,
  styles: [`
    .app-divider {
      display: block;
      width: 100%;
      height: 1px;
      margin: 0.5rem 0;
      background: var(--ds-border, #d7dbe3);
      border: none;
    }
    .app-divider-vertical {
      width: 1px;
      height: 100%;
      margin: 0 0.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppDivider extends DividerBase {}
