import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { DividerBase } from "@ui/base/divider.base";

@Component({
  selector: "ili-divider",
  standalone: true,
  template: `
    <div
      class="ili-divider"
      [class.ili-divider-vertical]="layout() === 'vertical'"
      role="separator"
    ></div>
  `,
  styles: [`
    .ili-divider {
      display: block;
      width: 100%;
      height: 1px;
      margin: 0.5rem 0;
      background: var(--ds-border, #d7dbe3);
      border: none;
    }
    .ili-divider-vertical {
      width: 1px;
      height: 100%;
      margin: 0 0.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliDivider extends DividerBase {}
