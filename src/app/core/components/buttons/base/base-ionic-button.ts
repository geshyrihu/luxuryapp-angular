import { Directive, inject, input, output } from "@angular/core";
import { Router, UrlTree } from "@angular/router";

/**
 * 📱 BASE IONIC BUTTON (Mobile)
 * -------------------------------------------------------------------------
 * Clase base para todos los botones de vistas móviles con Ionic.
 * Mismos inputs/outputs que BaseButton para mantener compatibilidad de API.
 * Para botones web/desktop PrimeNG, ver: BaseButton
 *
 * Colores Ionic disponibles:
 *   primary | secondary | tertiary | success | warning | danger | light | medium | dark
 *
 * Fill options:
 *   solid | outline | clear | default
 */
@Directive({})
export abstract class BaseIonicButton {
  protected readonly router = inject(Router);

  // <--- 🎨 Estilos básicos --->
  disabled = input<boolean>(false);
  customClass = input<string>("");

  // <--- 📝 Contenido --->
  label = input<string>("");

  /**
   * iconName: nombre del icono de Ionicons (sin extensión)
   * Ejemplos: 'create-outline', 'trash-outline', 'add-outline', 'save-outline'
   * Catálogo: https://ionic.io/ionicons
   */
  iconName = input<string>("");
  emoji = input<string>("");

  // <--- 🎨 Estilos Ionic --->
  /** Color Ionic: primary | secondary | tertiary | success | warning | danger | light | medium | dark */
  color = input<string>("primary");

  /** Fill del botón Ionic */
  fill = input<"solid" | "outline" | "clear" | "default">("outline");

  /** expand: hace el botón de ancho completo */
  expand = input<"full" | "block" | null>(null);

  /** size: tamaño del botón Ionic */
  size = input<"small" | "default" | "large">("default");

  /** lines: separador del ion-item */
  lines = input<"full" | "inset" | "none">("full");

  // <--- 👁️ Visibilidad --->
  mostrar = input<boolean>(true);

  // <--- 🧭 Navegación Router --->
  routerLink = input<string | any[] | UrlTree | null>(null);

  // <--- 📡 Eventos --->
  clicked = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.clicked.emit(event);

    const link = this.routerLink();
    if (link) {
      if (link instanceof UrlTree) {
        this.router.navigateByUrl(link);
      } else {
        const commands = typeof link === "string" ? [link] : (link as any[]);
        this.router.navigate(commands);
      }
    }
  }
}
