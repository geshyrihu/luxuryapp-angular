import { Component, inject } from "@angular/core";
import { AvatarBase } from "@ui/base/avatar.base";
import { MobileAvatar } from "@ui/mobile/avatar/avatar";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de Avatar. Renderiza `app-avatar` (PrimeNG) o
 * `ili-avatar` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-avatar [image]="..." shape="circle" />`.
 */
@Component({
  selector: "lx-avatar",

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
