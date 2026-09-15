import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { AvatarBase } from "@ui/base/avatar.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

/**
 * AppAvatar — CSS propio. Prioridad image > label > icono (`app-icon`).
 */
@Component({
  selector: "app-avatar",

  imports: [AppIcon],
  template: `
    <div
      class="app-avatar"
      [class.app-avatar-circle]="shape() === 'circle'"
      [class.app-avatar-square]="shape() === 'square'"
      [class]="styleClass()"
      [style.width.px]="sizePx()"
      [style.height.px]="sizePx()"
    >
      @if (image()) {
        <img [src]="image()" class="app-avatar-img" alt="" />
      } @else if (label()) {
        <span class="app-avatar-label">{{ label() }}</span>
      } @else if (icon()) {
        <app-icon [icon]="icon()" />
      }
    </div>
  `,
  styles: [
    `
      .app-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: var(--ds-bg-muted);
        color: var(--ds-text-secondary);
        font-weight: 600;
        flex-shrink: 0;
      }
      .app-avatar-circle {
        border-radius: 50%;
      }
      .app-avatar-square {
        border-radius: var(--ds-radius-md);
      }
      .app-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .app-avatar-label {
        font-size: 0.875em;
        text-transform: uppercase;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppAvatar extends AvatarBase {}
