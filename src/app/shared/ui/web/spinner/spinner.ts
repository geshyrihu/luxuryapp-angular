import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
} from "@angular/core";
import { SpinnerBase } from "@ui/base/spinner.base";

/**
 * AppSpinner — spinner circular CSS puro (Bootstrap `.spinner-border`) con
 * tamaño y color semántico.
 */
@Component({
  selector: "app-spinner",

  imports: [],
  template: `
    <div
      class="spinner-border"
      role="status"
      [style.width]="sizePx()"
      [style.height]="sizePx()"
      [style.border-width.px]="strokeWidth()"
      [style.color]="colorVar()"
      [attr.aria-label]="ariaLabel()"
    >
      <span class="visually-hidden">{{ ariaLabel() }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppSpinner extends SpinnerBase {
  colorVar = computed<string>(() => {
    const map: Record<string, string> = {
      primary: "var(--ds-primary)",
      success: "var(--ds-success)",
      warning: "var(--ds-warning)",
      danger: "var(--ds-danger)",
      neutral: "var(--ds-text-secondary)",
    };
    return map[this.color()] ?? "var(--ds-primary)";
  });
}
