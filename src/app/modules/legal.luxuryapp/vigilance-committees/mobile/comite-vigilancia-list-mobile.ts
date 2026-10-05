import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ComiteVigilancia } from "@core/interfaces/comite-vigilancia.interface";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelSendEmail } from "@ui/buttons/mobile-label/button-send-email";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

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
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelSendEmail,
    DataViewMobile,
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
