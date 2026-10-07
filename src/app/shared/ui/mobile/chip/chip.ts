import { Component, ViewEncapsulation } from "@angular/core";
import { IonChip, IonLabel } from "@ionic/angular";
import { ChipBase } from "@ui/core/chip.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

/**
 * MobileChip — Chip táctil sobre `ion-chip`. Icono/imagen opcional al inicio,
 * etiqueta y botón de remoción (`app-icon`) al final.
 */
@Component({
  selector: "lux-chip-mobile",

  imports: [IonChip, IonLabel, AppIconMobile],
  template: `
    <ion-chip
      [color]="ionColor()"
      [disabled]="disabled()"
      [class.lux-chip-mobile-clickable]="clickable()"
      (click)="onClick()"
    >
      @if (image()) {
        <img class="lux-chip-mobile-img" [src]="image()" alt="" />
      } @else if (icon()) {
        <lux-icon-mobile [icon]="icon()" class="lux-chip-mobile-icon" />
      }

      <ion-label>{{ label() }}</ion-label>

      @if (removable() && !disabled()) {
        <button
          type="button"
          class="lux-chip-mobile-remove"
          aria-label="Quitar"
          (click)="onRemove(); $event.stopPropagation()"
        >
          <lux-icon-mobile icon="material-symbols-light:cancel" />
        </button>
      }
    </ion-chip>
  `,
  styles: [
    `
      lux-chip-mobile ion-chip.lux-chip-mobile-clickable {
        cursor: pointer;
      }
      .lux-chip-mobile-img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 0.35rem;
      }
      .lux-chip-mobile-icon {
        display: inline-flex;
        margin-right: 0.35rem;
        font-size: 1.05rem;
      }
      .lux-chip-mobile-remove {
        background: none;
        border: none;
        padding: 0;
        margin-left: 0.35rem;
        display: inline-flex;
        align-items: center;
        color: inherit;
        opacity: 0.7;
        cursor: pointer;
      }
      .lux-chip-mobile-remove:hover {
        opacity: 1;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileChip extends ChipBase {
  /** Mapea el color semántico a la paleta de Ionic. */
  ionColor(): string {
    const map: Record<string, string> = {
      primary: "primary",
      secondary: "secondary",
      success: "success",
      warning: "warning",
      danger: "danger",
      neutral: "medium",
    };
    return map[this.color()] ?? "medium";
  }
}

