import { NgStyle } from "@angular/common";
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
import { ApplicationRoleDto } from "../interfaces/application-role.dto";

@Component({
  selector: "app-roles-list-mobile",
  templateUrl: "./roles-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    NgStyle,
    LxIcon,
    MobileActionMenu,
    MobileListItem,
    LuxDataViewMobile,
  ],
})
export class RolesListMobile {
  data = input.required<ApplicationRoleDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
