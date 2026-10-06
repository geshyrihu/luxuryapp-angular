import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { StatusBadge } from "@ui/web/status-badge/status-badge";

@Component({
  selector: "app-aspel-customer-empresa-list-mobile",
  templateUrl: "./aspel-customer-empresa-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    DataViewMobile,
    StatusBadge],
})
export class AspelCustomerEmpresaListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  modalForm = output<any>();
  delete = output<string>();
}
