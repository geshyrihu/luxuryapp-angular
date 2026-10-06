import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from '@ui/adaptive/icon/icon';
import { TiempoExtraDTO } from "../../interfaces/tiempo-extra.interface";

@Component({
  selector: "app-tiempo-extra-mobile",
  templateUrl: "./tiempo-extra-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    LxIcon,
    MobileListItem,
    LxTag,
    ButtonMobile,
    DataViewMobile,
  ],
})
export class TiempoExtraMobile {
  data = input.required<TiempoExtraDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<TiempoExtraDTO>();
  delete = output<TiempoExtraDTO>();
}
