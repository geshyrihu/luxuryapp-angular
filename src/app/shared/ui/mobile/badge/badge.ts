import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { IonBadge } from "@ionic/angular/standalone";
import { BadgeBase } from "@ui/base/badge.base";

/**
 * MobileBadge — Badge sobre `ion-badge` con color semántico y tamaño.
 */
@Component({
  selector: "ili-badge",
  standalone: true,
  imports: [CommonModule, IonBadge],
  template: `
    <ion-badge [color]="ionColor()" [class]="'ili-badge-' + size()">{{ displayValue() }}</ion-badge>
  `,
  styles: [`
    ili-badge .ili-badge-small { font-size: 0.65rem; padding: 2px 5px; }
    ili-badge .ili-badge-large { font-size: 0.95rem; padding: 5px 9px; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileBadge extends BadgeBase {}
