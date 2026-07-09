import { Component, inject } from "@angular/core";
import { BadgeBase } from "@ui/base/badge.base";
import { MobileBadge } from "@ui/mobile/badge/badge";
import { AppBadge } from "@ui/web/badge/badge";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de Badge. Renderiza `app-badge` (PrimeNG) o
 * `ili-badge` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-badge [value]="..." />`.
 */
@Component({
  selector: "lx-badge",

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
