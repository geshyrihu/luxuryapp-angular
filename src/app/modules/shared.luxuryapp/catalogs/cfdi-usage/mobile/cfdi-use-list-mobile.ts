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
import { CfdiUseDto } from "../interfaces/cfdi-use.dto";

@Component({
  selector: "app-cfdi-use-list-mobile",
  templateUrl: "./cfdi-use-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    MobileButtonLabelDelete,
    MobileButtonLabelEdit,
    MobileListItem,
    DataViewMobile,
    AppIcon,
  ],
})
export class CfdiUseListMobile {
  data = input.required<CfdiUseDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
