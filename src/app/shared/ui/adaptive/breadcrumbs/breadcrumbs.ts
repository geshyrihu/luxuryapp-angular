import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { Breadcrumbs } from "@ui/web/breadcrumbs/breadcrumbs";
import { MobileBreadcrumbs } from "@ui/mobile/breadcrumbs/breadcrumbs";
import { BreadcrumbsBase } from "@ui/base/breadcrumbs.base";

/**
 * Wrapper multiplataforma de Breadcrumbs. Renderiza `app-breadcrumbs` (PrimeNG)
 * o `ili-breadcrumbs` (scroll horizontal nativo) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-breadcrumbs [items]="..." />`.
 */
@Component({
  selector: "lx-breadcrumbs",
  standalone: true,
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
