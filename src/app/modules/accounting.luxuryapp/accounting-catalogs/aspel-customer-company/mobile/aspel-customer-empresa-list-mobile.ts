import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { StatusBadge } from "@ui/web/status-badge/status-badge";

@Component({
  selector: "app-aspel-customer-empresa-list-mobile",
  templateUrl: "./aspel-customer-empresa-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    DataViewMobile,
    StatusBadge,
  ],
})
export class AspelCustomerEmpresaListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  modalForm = output<any>();
  delete = output<string>();
}
