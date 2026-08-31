import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from "@angular/core";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";
import { AppIconIonicon } from "src/app/shared/ui/shared/app-icon/app-icon.catalog-ionicon";

/**
 * Variante móvil de AppIcon. Resuelve el mismo catálogo conceptual
 * (AppIconName) pero renderiza `<ion-icon>` en vez de `<iconify-icon>`.
 *
 * Acepta:
 *  - Clave del catálogo: `icon="Person"` → resuelve contra AppIconIonicon
 *  - Literal ionicon:   `icon="person-outline"` → se usa directo
 *  - Iconify legacy:    `icon="material-symbols-light:person"` → extrae nombre
 *
 * Selector: `ili-icon` (consistente con patrón `ili-*` del repo).
 */
@Component({
  selector: "ili-icon",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<ion-icon [name]="resolvedName()"></ion-icon>`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        vertical-align: middle;
      }
      ion-icon {
        display: inline-block;
        width: 1em;
        height: 1em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIconMobile {
  icon = input<AppIconName | string | null | undefined>();

  protected resolvedName = computed(() => resolveIoniconName(this.icon()));
}

function resolveIoniconName(
  value: AppIconName | string | null | undefined,
): string {
  if (!value) return "settings-outline";

  // 1. Ya es un nombre de ionicon (sin ":") — usar directo
  if (!value.includes(":")) {
    // Verificar si es clave del catálogo
    const fromCatalog =
      AppIconIonicon[value as keyof typeof AppIconIonicon];
    if (fromCatalog) return fromCatalog;
    // Asumir que es un nombre de ionicon válido
    return value;
  }

  // 2. Formato Iconify "material-symbols-light:nombre" — extraer nombre
  const iconifyName = value.split(":")[1];
  if (iconifyName) {
    // Buscar el nombre de ionicon por el nombre limpio de iconify
    const ioniconName = AppIconIonicon[iconifyName as keyof typeof AppIconIonicon];
    if (ioniconName) return ioniconName;
    // Fallback: usar el nombre de iconify como nombre de ionicon
    // (muchos nombres son compatibles entre ambos sets)
    return iconifyName;
  }

  return "settings-outline";
}
