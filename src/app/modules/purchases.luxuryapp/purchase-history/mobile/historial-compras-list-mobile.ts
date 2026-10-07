import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-historial-compras-list-mobile",
  templateUrl: "./historial-compras-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    CommonModule,
    ApiDatePipe,
    MobileActionMenu,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class HistorialComprasListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  viewOrder = output<string>();
}
