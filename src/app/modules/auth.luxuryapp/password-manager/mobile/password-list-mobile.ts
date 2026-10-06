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
import { CredentialDetailDto } from "../interfaces/credential-detail.dto";

@Component({
  selector: "app-password-list-mobile",
  templateUrl: "./password-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    DataViewMobile,
    MobileActionMenu,
    MobileListItem,
    LxIcon],
})
export class PasswordListMobile {
  data = input.required<CredentialDetailDto[]>();

  add = output<void>();
  edit = output<string>();
  delete = output<string>();
}
