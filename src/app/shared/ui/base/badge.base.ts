import { Directive, input, computed } from "@angular/core";

export type BadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type BadgeSizeToken = "small" | "normal" | "large";

/**
 * Base compartida de Badge (contador/etiqueta breve).
 *  - web:     `app-badge`  (PrimeNG p-badge)
 *  - mobile:  `ili-badge`  (Ionic ion-badge)
 *  - wrapper: `lx-badge`   (auto runtime)
 */
@Directive()
export abstract class BadgeBase {
  value = input<string | number>("");
  color = input<BadgeColor>("neutral");
  size = input<BadgeSizeToken>("normal");

  /** Texto a mostrar; vacío/0 sigue renderizando salvo que el consumidor lo oculte. */
  displayValue = computed<string>(() => {
    const v = this.value();
    return v === null || v === undefined ? "" : String(v);
  });

  /** Mapea el color semántico a la paleta de Ionic (`ion-badge [color]`). */
  ionColor = computed<string>(() => {
    const map: Record<BadgeColor, string> = {
      primary: "primary",
      secondary: "secondary",
      success: "success",
      warning: "warning",
      danger: "danger",
      info: "tertiary",
      neutral: "medium",
    };
    return map[this.color()] ?? "medium";
  });
}
