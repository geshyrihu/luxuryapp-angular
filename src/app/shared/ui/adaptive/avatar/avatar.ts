import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { AvatarBase } from "@ui/core/avatar.base";
import { MobileAvatar } from "@ui/mobile/avatar/avatar";
import { AppAvatar } from "@ui/web/avatar/avatar";

/**
 * Wrapper multiplataforma de Avatar. Renderiza `app-avatar` (Bootstrap) o
 * `lux-avatar-mobile` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-avatar [image]="..." shape="circle" />`.
 */
@Component({
  selector: "lux-avatar",
  imports: [AppAvatar, MobileAvatar],
  template: `
    @if (platform.isMobile()) {
      <lux-avatar-mobile
        [image]="image()"
        [label]="label()"
        [icon]="icon()"
        [shape]="shape()"
        [size]="size()"
        [styleClass]="styleClass()"
      />
    } @else {
      <lux-avatar-web
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
