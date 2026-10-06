import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";

@Component({
  selector: "app-historial-compras-list-mobile",
  templateUrl: "./historial-compras-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    CommonModule,
    ApiDatePipe,
    MobileActionMenu,
    DataViewMobile,
    MobileListItem,
    LxIcon],
})
export class HistorialComprasListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  viewOrder = output<string>();
}
