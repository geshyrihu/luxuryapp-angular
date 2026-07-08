import { Directive, input } from "@angular/core";

/**
 * Base compartida de Image (display de imagen con preview opcional).
 *  - web:     `app-image`  (PrimeNG p-image, con lightbox/preview)
 *  - mobile:  `ili-image`  (Ionic ion-img, lazy-load nativo)
 *  - wrapper: `lx-image`   (auto runtime)
 */
@Directive()
export abstract class ImageBase {
  src = input<string>("");
  alt = input<string>("");
  /** Habilita el visor/lightbox (solo web; en móvil se ignora). */
  preview = input<boolean>(false);
  /** Ancho: número (px) o string CSS (`100%`, `10rem`). */
  width = input<string | number | undefined>(undefined);
  height = input<string | number | undefined>(undefined);
  /** Clase CSS aplicada al elemento `<img>` interno. */
  imageClass = input<string>("");
  /** Clase CSS aplicada al contenedor (host) del componente. */
  styleClass = input<string>("");
  /** Destino de montaje del preview (solo web; ej. `"body"`). */
  appendTo = input<string | undefined>(undefined);
  /** Estilos inline aplicados al elemento `<img>` interno. */
  imageStyle = input<Record<string, string> | undefined>(undefined);

  /** String de ancho para p-image (o undefined). */
  widthStr(): string | undefined {
    const w = this.width();
    return w === undefined || w === null || w === "" ? undefined : String(w);
  }

  heightStr(): string | undefined {
    const h = this.height();
    return h === undefined || h === null || h === "" ? undefined : String(h);
  }

  /** Convierte un tamaño a CSS: número → `<n>px`; numérico string → `<n>px`; con unidad → tal cual. */
  private cssSize(v: string | number | undefined): string | undefined {
    if (v === undefined || v === null || v === "") return undefined;
    return /^\d+$/.test(String(v)) ? `${v}px` : String(v);
  }

  /** Estilo combinado (width/height + imageStyle) para el móvil. */
  mobileStyle(): Record<string, string> {
    const style: Record<string, string> = { ...(this.imageStyle() ?? {}) };
    const w = this.cssSize(this.width());
    const h = this.cssSize(this.height());
    if (w) style["width"] = w;
    if (h) style["height"] = h;
    return style;
  }
}
