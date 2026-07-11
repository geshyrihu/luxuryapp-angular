import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PullToRefreshBase } from "@ui/base/pull-to-refresh.base";
import { MobilePullToRefresh } from "@ui/mobile/pull-to-refresh/pull-to-refresh";
import { PullToRefresh } from "@ui/web/pull-to-refresh/pull-to-refresh";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-pull-to-refresh",

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
      <app-pull-to-refresh (refresh)="refresh.emit()">
        <ng-container [ngTemplateOutlet]="projected" />
      </app-pull-to-refresh>
    }
  `,
})
export class LxPullToRefresh extends PullToRefreshBase {
  protected platform = inject(PlatformService);
}
