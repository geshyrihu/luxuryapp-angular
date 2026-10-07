import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-employee-emergency-contact-list-mobile",
  templateUrl: "./employee-emergency-contact-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    LuxDataViewMobile,
  ],
})
export class EmployeeEmergencyContactListMobile {
  dataEmergencyContact = input.required<any[]>();
  dataBeneficiary = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isReadOnly = input<boolean>(false);

  add = output<{
    id: string;
    title: string;
    contacOfBeneficiary: number;
  }>();
  edit = output<{
    id: string;
    title: string;
    contacOfBeneficiary: number;
  }>();
  delete = output<{ id: string; typeContact: number }>();
}
