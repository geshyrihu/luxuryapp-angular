import { Component, inject } from "@angular/core";
import { OrderListBase } from "@ui/base/order-list.base";
import { MobileOrderList } from "@ui/mobile/order-list/order-list";
import { OrderList } from "@ui/web/order-list/order-list";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-order-list",

  imports: [OrderList, MobileOrderList],
  template: `
    @if (platform.isMobile()) {
      <ili-order-list [(value)]="value" [listStyle]="listStyle()">
        <ng-content />
      </ili-order-list>
    } @else {
      <app-order-list [(value)]="value" [listStyle]="listStyle()">
        <ng-content />
      </app-order-list>
    }
  `,
})
export class LxOrderList extends OrderListBase {
  protected platform = inject(PlatformService);
}
