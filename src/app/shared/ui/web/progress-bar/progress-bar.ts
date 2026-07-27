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
  /** Color CSS del valor de la barra, mapeado desde el color semántico. */
  barColor = computed<string>(() => {
    const map: Record<string, string> = {
      primary: "var(--ds-primary, #2563eb)",
      success: "var(--ds-success, #16a34a)",
      warning: "var(--ds-warning, #d97706)",
      danger: "var(--ds-danger, #dc2626)",
    };
    return map[this.color()] ?? "var(--ds-primary, #2563eb)";
  });
}
