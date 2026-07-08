import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AvatarModule } from "primeng/avatar";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { AvatarBase } from "@ui/base/avatar.base";

/**
 * AppAvatar — Wrapper sobre p-avatar. Prioridad image > label > icono (`app-icon`).
 */
@Component({
  selector: "app-avatar",
  standalone: true,
  imports: [CommonModule, AvatarModule, AppIcon],
  template: `
    <p-avatar
      [image]="image() || undefined"
      [label]="!image() ? (label() || undefined) : undefined"
      [shape]="shape()"
      [size]="size()"
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
