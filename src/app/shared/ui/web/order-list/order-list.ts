import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { OrderListBase } from "@ui/base/order-list.base";
import { OrderListModule } from "primeng/orderlist";

@Component({
  selector: "app-order-list",

  imports: [CommonModule, OrderListModule],
  template: `
    <p-orderList
      [(value)]="value"
      [listStyle]="listStyle()"
      styleClass="w-full"
    >
      <ng-template let-item pTemplate="item">
        <ng-container
          *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
        />
      </ng-template>
    </p-orderList>
    <ng-template #itemTemplate let-item>
      <ng-content [select]="'[orderListItem]'" />
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class OrderList extends OrderListBase {}
