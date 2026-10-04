import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { PullToRefreshBase } from "@ui/core/pull-to-refresh.base";
import { MobilePullToRefresh } from "@ui/mobile/pull-to-refresh/pull-to-refresh";
import { PullToRefresh } from "@ui/web/pull-to-refresh/pull-to-refresh";

@Component({
  selector: "lux-pull-to-refresh",

  imports: [NgTemplateOutlet, PullToRefresh, MobilePullToRefresh],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-pull-to-refresh (refresh)="refresh.emit()">
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-pull-to-refresh>
    } @else {
      <lux-pull-to-refresh-web (refresh)="refresh.emit()">
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-pull-to-refresh-web>
    }
  `,
})
export class LxPullToRefresh extends PullToRefreshBase {
  protected platform = inject(PlatformService);
}
