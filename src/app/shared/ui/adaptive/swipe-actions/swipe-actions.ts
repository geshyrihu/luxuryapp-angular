import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { SwipeActionsBase } from "@ui/base/swipe-actions.base";
import { MobileSwipeActions } from "@ui/mobile/swipe-actions/swipe-actions";
import { SwipeActions } from "@ui/web/swipe-actions/swipe-actions";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-swipe-actions",

  imports: [NgTemplateOutlet, SwipeActions, MobileSwipeActions],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-swipe-actions [actions]="actions()" [threshold]="threshold()">
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-swipe-actions>
    } @else {
      <app-swipe-actions [actions]="actions()" [threshold]="threshold()">
        <ng-container [ngTemplateOutlet]="projected" />
      </app-swipe-actions>
    }
  `,
})
export class LxSwipeActions extends SwipeActionsBase {
  protected platform = inject(PlatformService);
}
