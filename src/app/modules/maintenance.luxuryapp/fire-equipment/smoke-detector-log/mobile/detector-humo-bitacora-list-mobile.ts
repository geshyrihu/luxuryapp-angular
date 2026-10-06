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
  selector: "app-detector-humo-bitacora-list-mobile",
  templateUrl: "./detector-humo-bitacora-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class DetectorHumoBitacoraListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  pdfReport = output<void>();
}
