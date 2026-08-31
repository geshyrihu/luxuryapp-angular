import { Component, ViewEncapsulation } from "@angular/core";
import { IonChip, IonLabel } from "@ionic/angular/standalone";
import { ChipBase } from "@ui/base/chip.base";
import { AppIconMobile } from "src/app/shared/ui/mobile/app-icon/app-icon";

/**
 * MobileChip — Chip táctil sobre `ion-chip`. Icono/imagen opcional al inicio,
 * etiqueta y botón de remoción (`app-icon`) al final.
 */
@Component({
  selector: "ili-chip",

  imports: [IonChip, IonLabel, AppIconMobile],
  template: `
    <ion-chip
      [color]="ionColor()"
      [disabled]="disabled()"
      [class.ili-chip-clickable]="clickable()"
      (click)="onClick()"
    >
      @if (image()) {
        <img class="ili-chip-img" [src]="image()" alt="" />
      } @else if (icon()) {
        <ili-icon [icon]="icon()" class="ili-chip-icon" />
      }

      <ion-label>{{ label() }}</ion-label>

      @if (removable() && !disabled()) {
        <button
          type="button"
          class="ili-chip-remove"
          aria-label="Quitar"
          (click)="onRemove(); $event.stopPropagation()"
        >
          <ili-icon icon="material-symbols-light:cancel" />
        </button>
      }
    </ion-chip>
  `,
  styles: [
    `
      ili-chip ion-chip.ili-chip-clickable {
        cursor: pointer;
      }
      .ili-chip-img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 0.35rem;
      }
      .ili-chip-icon {
        display: inline-flex;
        margin-right: 0.35rem;
        font-size: 1.05rem;
      }
      .ili-chip-remove {
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
      .ili-chip-remove:hover {
        opacity: 1;
      }
    `,
  ],
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
