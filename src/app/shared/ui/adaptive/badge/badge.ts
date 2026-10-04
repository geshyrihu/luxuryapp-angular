import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { BadgeBase } from "@ui/core/badge.base";
import { MobileBadge } from "@ui/mobile/badge/badge";
import { AppBadge } from "@ui/web/badge/badge";

/**
 * Wrapper multiplataforma de Badge. Renderiza `app-badge` (Bootstrap) o
 * `ili-badge` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-badge [value]="..." />`.
 */
@Component({
  selector: "lux-badge",
  imports: [AppBadge, MobileBadge],
  template: `
    @if (platform.isMobile()) {
      <ili-badge [value]="value()" [color]="color()" [size]="size()" />
    } @else {
      <app-badge [value]="value()" [color]="color()" [size]="size()" />
    }
  `,
})
export class LxBadge extends BadgeBase {
  protected platform = inject(PlatformService);
}
