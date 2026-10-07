import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { TagBase } from "@ui/core/tag.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-tag-mobile",

  imports: [AppIconMobile],
  template: `
    <span
      class="lux-tag-mobile"
      [class.lux-tag-mobile-rounded]="rounded()"
      [style.background]="colors().bg"
      [style.color]="colors().text"
      [style.border-color]="colors().border"
      [attr.title]="tooltip()"
    >
      @if (icon()) {
        <lux-icon-mobile [icon]="icon()" class="lux-tag-mobile-icon" />
      }
      {{ displayValue() }}
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .lux-tag-mobile {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        min-height: 1.6rem;
        padding: 0.15rem 0.6rem;
        border-radius: var(--ds-radius-sm);
        border: 1px solid transparent;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1.2;
        white-space: nowrap;
      }
      .lux-tag-mobile-rounded {
        border-radius: var(--ds-radius-full);
      }
      .lux-tag-mobile-icon {
        display: inline-flex;
        font-size: 0.85rem;
        line-height: 1;
      }
    `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileTag extends TagBase {}

