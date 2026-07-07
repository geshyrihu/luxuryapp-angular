import { Directive, input } from "@angular/core";

export type ProgressBarMode = "determinate" | "indeterminate";

/**
 * Base compartida de ProgressBar.
 *  - web:     `app-progress-bar`  (PrimeNG p-progressbar, value 0..100)
 *  - mobile:  `ili-progress-bar`  (Ionic ion-progress-bar, value 0..1)
 *  - wrapper: `lx-progress-bar`   (auto runtime)
 *
 * API canónica: `value` en porcentaje 0..100.
 */
@Directive()
export abstract class ProgressBarBase {
  /** Porcentaje 0..100. */
  value = input<number>(0);
  mode = input<ProgressBarMode>("determinate");
  showValue = input<boolean>(true);
  unit = input<string>("%");
  color = input<string>("primary");

  /** Valor 0..100 acotado. */
  clampedValue(): number {
    return Math.max(0, Math.min(100, this.value() ?? 0));
  }

  /** Valor 0..1 para Ionic. */
  fraction(): number {
    return this.clampedValue() / 100;
  }
}
