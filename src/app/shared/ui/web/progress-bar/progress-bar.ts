import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed
} from "@angular/core";
import { ProgressBarBase } from "@ui/base/progress-bar.base";

/**
 * AppProgressBar — `.progress`/`.progress-bar` de Bootstrap. `value` en 0..100.
 */
@Component({
  selector: "app-progress-bar",

  imports: [],
  template: `
    <div class="progress" role="progressbar" [attr.aria-valuenow]="clampedValue()" aria-valuemin="0" aria-valuemax="100">
      <div
        class="progress-bar"
        [class.progress-bar-striped]="mode() === 'indeterminate'"
        [class.progress-bar-animated]="mode() === 'indeterminate'"
        [style.width.%]="mode() === 'determinate' ? clampedValue() : 100"
        [style.background-color]="barColor()"
      >
        @if (showValue() && mode() === 'determinate') {
          {{ clampedValue() }}{{ unit() }}
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppProgressBar extends ProgressBarBase {
  /** Color CSS del valor de la barra, mapeado desde el color semántico ya resuelto. */
  barColor = computed<string>(() => {
    const map: Record<string, string> = {
      primary: "var(--ds-primary)",
      success: "var(--ds-success)",
      warning: "var(--ds-warning)",
      danger: "var(--ds-danger)",
    };
    return map[this.resolvedColor()] ?? "var(--ds-primary)";
  });
}
