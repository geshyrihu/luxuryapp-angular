import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { OrderListBase } from "@ui/base/order-list.base";
import { MobileOrderList } from "@ui/mobile/order-list/order-list";
import { OrderList } from "@ui/web/order-list/order-list";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-order-list",

  imports: [NgTemplateOutlet, OrderList, MobileOrderList],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-order-list [(value)]="value" [listStyle]="listStyle()">
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-order-list>
    } @else {
      <app-order-list [(value)]="value" [listStyle]="listStyle()">
        <ng-container [ngTemplateOutlet]="projected" />
      </app-order-list>
    }
  `,
})
export class LxOrderList extends OrderListBase {
  protected platform = inject(PlatformService);
}
