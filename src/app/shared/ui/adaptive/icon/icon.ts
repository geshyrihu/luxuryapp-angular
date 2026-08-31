import { Component, inject } from "@angular/core";
import { input } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";
import { PlatformService } from "src/app/core/services/platform.service";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

/**
 * Wrapper multiplataforma de Icon. Renderiza `app-icon` (iconify) o
 * `ili-icon` (ionicons) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-icon [icon]="AppIcon.Person" />`.
 */
@Component({
  selector: "lx-icon",
  imports: [AppIcon, AppIconMobile],
  template: `
    @if (platform.isMobile()) {
      <ili-icon [icon]="icon()" [class]="styleClass()" />
    } @else {
      <app-icon [icon]="icon()" [class]="styleClass()" />
    }
  `,
})
export class LxIcon {
  icon = input<AppIconName | string | null | undefined>();
  styleClass = input<string>();
  protected platform = inject(PlatformService);
}
