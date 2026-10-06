import { Component, inject, input } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import type { AppIconName } from "@ui/primitives/app-icon/app-icon.catalog";

/**
 * Wrapper multiplataforma de Icon. Renderiza `app-icon` (iconify) o
 * `ili-icon` (ionicons) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-icon [icon]="AppIcon.Person" />`.
 */
@Component({
  selector: "lux-icon",
  imports: [AppIcon, AppIconMobile],
  template: `
    @if (platform.isMobile()) {
      <ili-icon [icon]="icon()" [class]="styleClass()" />
    } @else {
      <lux-icon-base [icon]="icon()" [class]="styleClass()" />
    }
  `,
})
export class LxIcon {
  icon = input<AppIconName | string | null | undefined>();
  styleClass = input<string>();
  protected platform = inject(PlatformService);
}
