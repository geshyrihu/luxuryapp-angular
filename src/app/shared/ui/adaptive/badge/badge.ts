import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppBadge } from "@ui/web/badge/badge";
import { MobileBadge } from "@ui/mobile/badge/badge";
import { BadgeBase } from "@ui/base/badge.base";

/**
 * Wrapper multiplataforma de Badge. Renderiza `app-badge` (PrimeNG) o
 * `ili-badge` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-badge [value]="..." />`.
 */
@Component({
  selector: "lx-badge",
  standalone: true,
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
