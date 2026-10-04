import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppAvatar } from "@ui/web/avatar/avatar";

@Component({
  selector: "app-warehouse-stock-list-mobile",
  templateUrl: "./warehouse-stock-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppAvatar,
    MobileActionMenu,
    MobileButtonLabelDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    MobileListItem,
    DataViewMobile,
  ],
})
export class WarehouseStockListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<any>();
  addEntrada = output<any>();
  addSalida = output<any>();
  delete = output<string>();
}
