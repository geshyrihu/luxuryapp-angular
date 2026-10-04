import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { BreadcrumbsBase } from "@ui/core/breadcrumbs.base";
import { MobileBreadcrumbs } from "@ui/mobile/breadcrumbs/breadcrumbs";
import { Breadcrumbs } from "@ui/web/breadcrumbs/breadcrumbs";

/**
 * Wrapper multiplataforma de Breadcrumbs. Renderiza `app-breadcrumbs` (Bootstrap)
 * o `ili-breadcrumbs` (scroll horizontal nativo) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-breadcrumbs [items]="..." />`.
 */
@Component({
  selector: "lux-breadcrumbs",
  imports: [Breadcrumbs, MobileBreadcrumbs],
  template: `
    @if (platform.isMobile()) {
      <ili-breadcrumbs [items]="items()" [home]="home()" />
    } @else {
      <app-breadcrumbs [items]="items()" [home]="home()" />
    }
  `,
})
export class LxBreadcrumbs extends BreadcrumbsBase {
  protected platform = inject(PlatformService);
}
