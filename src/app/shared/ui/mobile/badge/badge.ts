import { Component, ViewEncapsulation } from "@angular/core";
import { IonBadge } from "@ionic/angular";
import { BadgeBase } from "@ui/core/badge.base";

/**
 * MobileBadge — Badge sobre `ion-badge` con color semántico y tamaño.
 */
@Component({
  selector: "lux-badge-mobile",

  imports: [IonBadge],
  template: `
    <ion-badge [color]="ionColor()" [class]="'lux-badge-mobile-' + size()">{{
      displayValue()
    }}</ion-badge>
  `,
  styles: [
    `
      lux-badge-mobile .lux-badge-mobile-small {
        font-size: 0.65rem;
        padding: 2px 5px;
      }
      lux-badge-mobile .lux-badge-mobile-large {
        font-size: 0.95rem;
        padding: 5px 9px;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileBadge extends BadgeBase {}
