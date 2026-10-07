import { Component, ViewEncapsulation } from "@angular/core";
import { IonAvatar } from "@ionic/angular";
import { AvatarBase } from "@ui/core/avatar.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

/**
 * MobileAvatar — Wrapper sobre `ion-avatar`. Prioridad image > label > icono.
 */
@Component({
  selector: "lux-avatar-mobile",

  imports: [IonAvatar, AppIconMobile],
  template: `
    <ion-avatar
      [class]="'lux-avatar-mobile ' + styleClass()"
      [class.lux-avatar-mobile-square]="shape() === 'square'"
      [style.width.px]="sizePx()"
      [style.height.px]="sizePx()"
    >
      @if (image()) {
        <img [src]="image()" [alt]="label()" />
      } @else if (label()) {
        <span class="lux-avatar-mobile-label">{{ label() }}</span>
      } @else if (icon()) {
        <lux-icon-mobile [icon]="icon()" class="lux-avatar-mobile-icon" />
      }
    </ion-avatar>
  `,
  styles: [
    `
      .lux-avatar-mobile {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--ds-bg-muted);
        color: var(--ds-text-secondary);
        overflow: hidden;
      }
      .lux-avatar-mobile-square {
        border-radius: 20%;
      }
      .lux-avatar-mobile-label {
        font-size: 0.8rem;
        font-weight: 600;
      }
      .lux-avatar-mobile-icon {
        font-size: 1.1rem;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileAvatar extends AvatarBase {}

