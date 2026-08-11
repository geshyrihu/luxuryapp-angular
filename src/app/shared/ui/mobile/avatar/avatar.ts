import { Component, ViewEncapsulation } from "@angular/core";
import { IonAvatar } from "@ionic/angular/standalone";
import { AvatarBase } from "@ui/base/avatar.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

/**
 * MobileAvatar — Wrapper sobre `ion-avatar`. Prioridad image > label > icono.
 */
@Component({
  selector: "ili-avatar",

  imports: [IonAvatar, AppIcon],
  template: `
    <ion-avatar
      [class]="'ili-avatar ' + styleClass()"
      [class.ili-avatar-square]="shape() === 'square'"
      [style.width.px]="sizePx()"
      [style.height.px]="sizePx()"
    >
      @if (image()) {
        <img [src]="image()" [alt]="label()" />
      } @else if (label()) {
        <span class="ili-avatar-label">{{ label() }}</span>
      } @else if (icon()) {
        <app-icon [icon]="icon()" class="ili-avatar-icon" />
      }
    </ion-avatar>
  `,
  styles: [
    `
      .ili-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--ds-bg-muted);
        color: var(--ds-text-secondary);
        overflow: hidden;
      }
      .ili-avatar-square {
        border-radius: 20%;
      }
      .ili-avatar-label {
        font-size: 0.8rem;
        font-weight: 600;
      }
      .ili-avatar-icon {
        font-size: 1.1rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileAvatar extends AvatarBase {}
