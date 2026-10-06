import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";

@Component({
  selector: "app-solicitudes-historial-mobile",
  templateUrl: "./solicitudes-historial-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ MobileListItem, LxTag, ApiDatePipe, DataViewMobile],
})
export class SolicitudesHistorialMobile {
  data = input.required<any[]>();
}
