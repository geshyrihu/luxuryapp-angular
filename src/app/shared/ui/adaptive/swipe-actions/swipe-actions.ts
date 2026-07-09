import { Component, inject } from "@angular/core";
import { SwipeActionsBase } from "@ui/base/swipe-actions.base";
import { MobileSwipeActions } from "@ui/mobile/swipe-actions/swipe-actions";
import { SwipeActions } from "@ui/web/swipe-actions/swipe-actions";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-swipe-actions",

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
