import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { AvatarBase } from "@ui/base/avatar.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { AvatarModule } from "primeng/avatar";

/**
 * AppAvatar — Wrapper sobre p-avatar. Prioridad image > label > icono (`app-icon`).
 */
@Component({
  selector: "app-avatar",

  imports: [AvatarModule, AppIcon],
  template: `
    <p-avatar
      [image]="image() || undefined"
      [label]="!image() ? label() || undefined : undefined"
      [shape]="shape()"
      [size]="size()"
      [class]="styleClass()"
    >
      @if (icon() && !image() && !label()) {
        <app-icon [icon]="icon()" />
      }
    </p-avatar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppAvatar extends AvatarBase {}
