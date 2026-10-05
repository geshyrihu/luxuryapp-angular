import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-vacantes-list-mobile",
  templateUrl: "./vacantes-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelItem,
    MobileActionMenu,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class VacantesListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isSuperUser = input<boolean>(false);

  edit = output<{ id: string }>();
  delete = output<string>();
  deletePermanente = output<string>();
  detail = output<string>();
  jobDescription = output<string>();
}
