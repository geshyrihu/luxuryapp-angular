import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ComiteVigilancia } from "@core/interfaces/comite-vigilancia.interface";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

export interface ComiteVigilanciaFormData {
  id: string;
  title: string;
  nameProperty?: string;
}

@Component({
  selector: "app-comite-vigilancia-list-mobile",
  templateUrl: "./comite-vigilancia-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    LuxDataViewMobile,
  ],
})
export class ComiteVigilanciaListMobile {
  data = input.required<ComiteVigilancia[]>();
  globalFilterFields = input<string[]>([]);

  add = output<ComiteVigilanciaFormData>();
  edit = output<ComiteVigilanciaFormData>();
  delete = output<string>();
  sendCredential = output<string>();
}
