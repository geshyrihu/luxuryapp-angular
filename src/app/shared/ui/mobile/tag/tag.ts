import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { TagBase } from "@ui/base/tag.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-tag",

  imports: [AppIcon],
  template: `
    <span
      class="ili-tag"
      [class.ili-tag-rounded]="rounded()"
      [style.background]="colors().bg"
      [style.color]="colors().text"
      [style.border-color]="colors().border"
      [attr.title]="tooltip()"
    >
      @if (icon()) {
        <app-icon [icon]="icon()" class="ili-tag-icon" />
      }
      {{ displayValue() }}
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .ili-tag {
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
      .ili-tag-rounded {
        border-radius: var(--ds-radius-full, 9999px);
      }
      .ili-tag-icon {
        display: inline-flex;
        font-size: 0.85rem;
        line-height: 1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileTag extends TagBase {}
