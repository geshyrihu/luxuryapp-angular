import { NgStyle } from "@angular/common";
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
import { ApplicationRoleDto } from "../interfaces/application-role.dto";

@Component({
  selector: "app-roles-list-mobile",
  templateUrl: "./roles-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgStyle,
    AppIcon,
    MobileActionMenu,
    MobileListItem,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    DataViewMobile,
  ],
})
export class RolesListMobile {
  data = input.required<ApplicationRoleDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
