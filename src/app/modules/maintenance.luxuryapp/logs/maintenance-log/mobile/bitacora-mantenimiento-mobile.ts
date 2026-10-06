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
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";

import { ButtonMobile } from "@ui/buttons/mobile";
@Component({
  selector: "app-bitacora-mantenimiento-mobile",
  templateUrl: "./bitacora-mantenimiento-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    RangoCalendarioyyyymmdd,
    ApiDatePipe,
    DataViewMobile,
    MobileListItem,
    MobileActionMenu,
  ],
})
export class BitacoraMantenimientoMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isJefeMantenimiento = input<boolean>(false);

  add = output<{ id: number; title: string }>();
  delete = output<any>();
}
