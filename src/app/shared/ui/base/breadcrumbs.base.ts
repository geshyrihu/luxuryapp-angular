import { Directive, input } from "@angular/core";
// Type-only: `MenuItem` es el modelo de menú estándar del proyecto; al ser
// import type se borra en compilación → cero acoplamiento de runtime con PrimeNG.

import { resolveIconifyIcon } from "src/app/shared/utils/icon-mapping";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";
import type { MenuItem } from "primeng/api";

/**
 * Base compartida de Breadcrumbs.
 *  - web:     `app-breadcrumbs` (PrimeNG p-breadcrumb)
 *  - mobile:  `ili-breadcrumbs` (scroll horizontal nativo con chevrons)
 *  - wrapper: `lx-breadcrumbs`  (auto runtime)
 * `MenuItem` (primeng/api) es el modelo de menú estándar del proyecto.
 */
@Directive()
export abstract class BreadcrumbsBase {
  items = input.required<MenuItem[]>();
  home = input<MenuItem | null>(null);

  /** Ejecuta el command del MenuItem (usado por la versión mobile). */
  /** Resuelve un nombre/clase/legacy a AppIconName para el binding de app-icon. */
  protected iconName(value: string | null | undefined): AppIconName {
    return resolveIconifyIcon(value) as AppIconName;
  }

  protected runCommand(item: MenuItem, event: Event): void {
    item.command?.({ originalEvent: event, item });
  }
}
