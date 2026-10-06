import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-solicitudes-cliente-list-mobile",
  templateUrl: "./solicitudes-cliente-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxIcon, MobileListItem, DataViewMobile],
})
export class SolicitudesClienteListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
}
