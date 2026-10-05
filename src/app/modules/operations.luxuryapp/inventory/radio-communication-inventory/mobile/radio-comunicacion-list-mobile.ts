import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { RadioComunicacion } from "@core/interfaces/radio-comunicacion.interface";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelDownload } from "@ui/buttons/mobile-label/button-download";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-radio-comunicacion-list-mobile",
  templateUrl: "./radio-comunicacion-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelDownload,
    MobileButtonLabelDelete,
    DataViewMobile,
  ],
})
export class RadioComunicacionListMobile {
  data = input.required<RadioComunicacion[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<RadioComunicacion>();
  delete = output<string>();
  downloadPdf = output<void>();
}
