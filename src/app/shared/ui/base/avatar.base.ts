import { Directive, input, computed } from "@angular/core";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

export type AvatarShape = "circle" | "square";
export type AvatarSize = "normal" | "large" | "xlarge";

/**
 * Base compartida de Avatar (imagen, iniciales o icono).
 *  - web:     `app-avatar`  (PrimeNG p-avatar)
 *  - mobile:  `ili-avatar`  (Ionic ion-avatar)
 *  - wrapper: `lx-avatar`   (auto runtime)
 *
 * Prioridad de contenido: image > label (iniciales) > icon (`app-icon`).
 */
@Directive()
export abstract class AvatarBase {
  image = input<string>("");
  /** Iniciales / texto corto. */
  label = input<string>("");
  /** Nombre de icono `app-icon` (fallback si no hay image/label). */
  icon = input<AppIconName>();
  shape = input<AvatarShape>("circle");
  size = input<AvatarSize>("normal");
  /** Clases CSS reenviadas al elemento avatar interno (color, margen, etc.). */
  styleClass = input<string>("");

  /** Diámetro en px según el token de tamaño (para el móvil). */
  sizePx = computed<number>(() => {
    const map: Record<AvatarSize, number> = { normal: 32, large: 48, xlarge: 64 };
    return map[this.size()] ?? 32;
  });
}
