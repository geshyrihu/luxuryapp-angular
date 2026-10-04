import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-product-entry-list-mobile",
  templateUrl: "./product-entry-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    DataViewMobile,
  ],
})
export class ProductEntryListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isSuperUsuario = input<boolean>(false);

  edit = output<any>();
  delete = output<string>();
}
