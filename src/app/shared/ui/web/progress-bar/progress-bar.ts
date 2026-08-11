import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed
} from "@angular/core";
import { ProgressBarBase } from "@ui/base/progress-bar.base";
import { ProgressBarModule } from "primeng/progressbar";

/**
 * AppProgressBar — Wrapper sobre p-progressbar. `value` en 0..100.
 */
@Component({
  selector: "app-progress-bar",

  imports: [ProgressBarModule],
  template: `
    <p-progressbar
      [value]="clampedValue()"
      [mode]="mode()"
      [showValue]="showValue() && mode() === 'determinate'"
      [unit]="unit()"
      [color]="barColor()"
    />
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
