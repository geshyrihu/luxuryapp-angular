import { Directive, input } from "@angular/core";

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
  icon = input<string>("");
  shape = input<AvatarShape>("circle");
  size = input<AvatarSize>("normal");

  /** Diámetro en px según el token de tamaño (para el móvil). */
  sizePx(): number {
    const map: Record<AvatarSize, number> = { normal: 32, large: 48, xlarge: 64 };
    return map[this.size()] ?? 32;
  }
}
