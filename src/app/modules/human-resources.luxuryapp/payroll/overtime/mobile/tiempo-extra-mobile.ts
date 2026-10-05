import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { TiempoExtraDTO } from "../../interfaces/tiempo-extra.interface";

@Component({
  selector: "app-tiempo-extra-mobile",
  templateUrl: "./tiempo-extra-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    AppIcon,
    MobileListItem,
    LxTag,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
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
