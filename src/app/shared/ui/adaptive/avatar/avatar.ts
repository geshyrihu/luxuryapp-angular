import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { MobileAvatar } from "@ui/mobile/avatar/avatar";
import { AvatarBase } from "@ui/base/avatar.base";

/**
 * Wrapper multiplataforma de Avatar. Renderiza `app-avatar` (PrimeNG) o
 * `ili-avatar` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-avatar [image]="..." shape="circle" />`.
 */
@Component({
  selector: "lx-avatar",
  standalone: true,
  imports: [AppAvatar, MobileAvatar],
  template: `
    @if (platform.isMobile()) {
      <ili-avatar
        [image]="image()"
        [label]="label()"
        [icon]="icon()"
        [shape]="shape()"
        [size]="size()"
        [styleClass]="styleClass()"
      />
    } @else {
      <app-avatar
        [image]="image()"
        [label]="label()"
        [icon]="icon()"
        [shape]="shape()"
        [size]="size()"
        [styleClass]="styleClass()"
      />
    }
  `,
})
export class LxAvatar extends AvatarBase {
  protected platform = inject(PlatformService);
}
