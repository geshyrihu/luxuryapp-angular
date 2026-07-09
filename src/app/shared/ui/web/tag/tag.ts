import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { TagBase } from "@ui/base/tag.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-tag",

  imports: [AppIcon, TooltipModule],
  template: `
    <span
      class="app-tag"
      [class.app-tag-rounded]="rounded()"
      [style.background]="colors().bg"
      [style.color]="colors().text"
      [style.border-color]="colors().border"
      [pTooltip]="tooltip()"
    >
      @if (icon()) {
        <app-icon [icon]="icon()" class="app-tag-icon" />
      }
      {{ displayValue() }}
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .app-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        min-height: 1.6rem;
        padding: 0.15rem 0.6rem;
        border-radius: var(--ds-radius-sm, 4px);
        border: 1px solid transparent;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1.2;
        white-space: nowrap;
      }
      .app-tag-rounded {
        border-radius: var(--ds-radius-full, 9999px);
      }
      .app-tag-icon {
        display: inline-flex;
        font-size: 0.85rem;
        line-height: 1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppTag extends TagBase {}
