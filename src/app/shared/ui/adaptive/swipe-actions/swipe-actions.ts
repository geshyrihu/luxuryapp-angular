import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { SwipeActionsBase } from "@ui/core/swipe-actions.base";
import { MobileSwipeActions } from "@ui/mobile/swipe-actions/swipe-actions";
import { SwipeActions } from "@ui/web/swipe-actions/swipe-actions";

@Component({
  selector: "lux-swipe-actions",

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
      <lux-swipe-actions-web [actions]="actions()" [threshold]="threshold()">
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-swipe-actions-web>
    }
  `,
})
export class LxSwipeActions extends SwipeActionsBase {
  protected platform = inject(PlatformService);
}
