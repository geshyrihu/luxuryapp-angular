import { computed, Directive, input } from "@angular/core";

/**
 * Base compartida de Spinner (indicador de carga circular).
 *  - web:     `app-spinner`  (Bootstrap p-progressspinner)
 *  - mobile:  `ili-spinner`  (Ionic ion-spinner)
 *  - wrapper: `lux-spinner`   (auto runtime)
 */
@Directive()
export abstract class SpinnerBase {
  /** Diámetro en px. */
  size = input<number>(40);
  color = input<string>("primary");
  /** Grosor del trazo (solo web). */
  strokeWidth = input<number>(4);
  ariaLabel = input<string>("Cargando");

  sizePx = computed<string>(() => {
    return `${this.size()}px`;
  });
}
