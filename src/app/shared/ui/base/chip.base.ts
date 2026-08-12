import { Directive, input, output } from "@angular/core";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

/**
 * Base compartida de Chip (API + lógica de remoción/click).
 *  - web:     `app-chip`  (PrimeNG p-chip)
 *  - mobile:  `ili-chip`  (Ionic ion-chip)
 *  - wrapper: `lx-chip`   (auto runtime)
 *
 * El icono se pasa como nombre de `app-icon` (Iconify), no como clase de PrimeIcons
 * ni `ion-icon`, para mantener la consistencia con el resto de la librería.
 */
@Directive()
export abstract class ChipBase {
  label = input<string>("");
  /** Nombre de icono `app-icon` (Iconify) opcional al inicio del chip. */
  icon = input<AppIconName>();
  /** URL de imagen opcional (avatar) al inicio del chip. */
  image = input<string>("");
  removable = input<boolean>(false);
  disabled = input<boolean>(false);
  clickable = input<boolean>(false);
  /**
   * Color semántico: `primary | secondary | success | warning | danger | neutral`.
   * En web se usa como clase CSS; en móvil se mapea a `color` de Ionic.
   */
  color = input<string>("neutral");

  removed = output<void>();
  chipClick = output<void>();

  onRemove(): void {
    if (this.disabled()) return;
    this.removed.emit();
  }

  onClick(): void {
    if (this.disabled() || !this.clickable()) return;
    this.chipClick.emit();
  }
}
