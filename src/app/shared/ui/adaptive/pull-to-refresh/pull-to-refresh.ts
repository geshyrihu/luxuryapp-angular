import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { PullToRefresh } from "@ui/web/pull-to-refresh/pull-to-refresh";
import { MobilePullToRefresh } from "@ui/mobile/pull-to-refresh/pull-to-refresh";
import { PullToRefreshBase } from "@ui/base/pull-to-refresh.base";

@Component({
  selector: "lx-pull-to-refresh",
  standalone: true,
  imports: [PullToRefresh, MobilePullToRefresh],
  template: `
    @if (platform.isMobile()) {
      <ili-pull-to-refresh (refresh)="refresh.emit()">
        <ng-content />
      </ili-pull-to-refresh>
    } @else {
      <app-pull-to-refresh (refresh)="refresh.emit()">
        <ng-content />
      </app-pull-to-refresh>
    }
  `,
})
export class LxPullToRefresh extends PullToRefreshBase {
  protected platform = inject(PlatformService);
}
