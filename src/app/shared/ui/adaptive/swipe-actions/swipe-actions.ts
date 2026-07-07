import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { SwipeActions } from "@ui/web/swipe-actions/swipe-actions";
import { MobileSwipeActions } from "@ui/mobile/swipe-actions/swipe-actions";
import { SwipeActionsBase } from "@ui/base/swipe-actions.base";

@Component({
  selector: "lx-swipe-actions",
  standalone: true,
  imports: [SwipeActions, MobileSwipeActions],
  template: `
    @if (platform.isMobile()) {
      <ili-swipe-actions [actions]="actions()" [threshold]="threshold()">
        <ng-content />
      </ili-swipe-actions>
    } @else {
      <app-swipe-actions [actions]="actions()" [threshold]="threshold()">
        <ng-content />
      </app-swipe-actions>
    }
  `,
})
export class LxSwipeActions extends SwipeActionsBase {
  protected platform = inject(PlatformService);
}
