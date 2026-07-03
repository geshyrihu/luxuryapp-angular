import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { ICON_CATALOG } from "src/app/core/utils/icon-mapping";

interface CatalogIcon {
  /** Nombre genérico usado en templates, ej: "icon.home" */
  key: string;
  /** Valor Iconify resuelto, ej: "material-symbols:home" */
  value: string;
}

@Component({
  selector: "app-web-icons",
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DividerModule,
    InputTextModule,
    AppIcon,
  ],
  templateUrl: "./web-icons.html",
})
export class WebIcons {
  /** Todos los iconos del catálogo, ordenados por nombre. */
  private readonly allIcons: CatalogIcon[] = Object.entries(ICON_CATALOG)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => a.key.localeCompare(b.key));

  protected readonly totalCount = this.allIcons.length;

  protected readonly search = signal("");
  protected readonly copiedKey = signal<string | null>(null);

  /** Iconos filtrados por el término de búsqueda (nombre o valor Iconify). */
  protected readonly filteredIcons = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.allIcons;
    return this.allIcons.filter(
      (icon) =>
        icon.key.toLowerCase().includes(term) ||
        icon.value.toLowerCase().includes(term),
    );
  });

  /** Copia el nombre genérico (icon.xxx) al portapapeles. */
  protected copyKey(key: string): void {
    navigator.clipboard?.writeText(key).then(() => {
      this.copiedKey.set(key);
      setTimeout(() => {
        if (this.copiedKey() === key) this.copiedKey.set(null);
      }, 1200);
    });
  }
}
