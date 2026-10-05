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
import { CredentialDetailDto } from "../interfaces/credential-detail.dto";

@Component({
  selector: "app-password-list-mobile",
  templateUrl: "./password-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataViewMobile,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileListItem,
    AppIcon,
  ],
})
export class PasswordListMobile {
  data = input.required<CredentialDetailDto[]>();

  add = output<void>();
  edit = output<string>();
  delete = output<string>();
}
