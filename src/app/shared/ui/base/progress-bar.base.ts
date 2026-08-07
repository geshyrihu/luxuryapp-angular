import { Directive, computed, input } from "@angular/core";

export type ProgressBarMode = "determinate" | "indeterminate";

/** Color semántico de la barra. `auto` lo deduce del valor. */
export type ProgressBarColor =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "auto";

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

  /**
   * Color de la barra. Con `auto` se deduce del avance según `colorThresholds`:
   * útil en indicadores de progreso donde el color comunica si vamos bien o mal.
   */
  color = input<ProgressBarColor | string>("primary");

  /**
   * Umbrales `[warning, success]` para `color="auto"`:
   * por debajo del primero es `danger`, por debajo del segundo `warning`,
   * de ahí en adelante `success`.
   */
  colorThresholds = input<[number, number]>([50, 80]);

  /**
   * Decimales del valor mostrado. Cero por defecto: un progreso no se lee con
   * decimales, y sin redondear PrimeNG imprime el float completo
   * (p. ej. "34.23010942123478%").
   */
  decimals = input<number>(0);

  /** Valor 0..100 acotado y redondeado a `decimals`. */
  clampedValue = computed<number>(() => {
    const acotado = Math.max(0, Math.min(100, this.value() ?? 0));
    const factor = 10 ** this.decimals();

    return Math.round(acotado * factor) / factor;
  });

  /** Valor 0..1 para Ionic. */
  fraction = computed<number>(() => {
    return this.clampedValue() / 100;
  });

  /** Color semántico ya resuelto (traduce `auto` a un color concreto). */
  resolvedColor = computed<string>(() => {
    const color = this.color();
    if (color !== "auto") return color;

    const [warning, success] = this.colorThresholds();
    const valor = this.clampedValue();

    if (valor < warning) return "danger";
    if (valor < success) return "warning";

    return "success";
  });
}
