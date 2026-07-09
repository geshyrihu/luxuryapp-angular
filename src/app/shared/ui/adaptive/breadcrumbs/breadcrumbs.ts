import { Component, inject } from "@angular/core";
import { BreadcrumbsBase } from "@ui/base/breadcrumbs.base";
import { MobileBreadcrumbs } from "@ui/mobile/breadcrumbs/breadcrumbs";
import { Breadcrumbs } from "@ui/web/breadcrumbs/breadcrumbs";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de Breadcrumbs. Renderiza `app-breadcrumbs` (PrimeNG)
 * o `ili-breadcrumbs` (scroll horizontal nativo) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-breadcrumbs [items]="..." />`.
 */
@Component({
  selector: "lx-breadcrumbs",

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
