import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { RadioComunicacion } from "@core/interfaces/radio-comunicacion.interface";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-radio-comunicacion-list-mobile",
  templateUrl: "./radio-comunicacion-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    LuxDataViewMobile,
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
