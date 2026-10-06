import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-orden-compra-list-mobile",
  templateUrl: "./orden-compra-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    CommonModule,
    ApiDatePipe,
    MobileActionMenu,
    DataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class OrdenCompraListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  tiposDeGasto = input<any[]>([]);
  tipoGasto = input<number>(0);
  statusCompra = input<number>(0);

  add = output<void>();
  selectTipoGasto = output<number>();
  selectStatus = output<number>();
  addOrEdit = output<string>();
  delete = output<string>();
}
