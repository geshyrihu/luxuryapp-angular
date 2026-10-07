import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";

@Component({
  selector: "app-bitacora-individual-mobile",
  templateUrl: "./bitacora-individual-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RangoCalendarioyyyymmdd,
    ApiDatePipe,
    LuxDataViewMobile,
    MobileListItem,
  ],
})
export class BitacoraIndividualMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  cardEmployee = output<string>();
}
