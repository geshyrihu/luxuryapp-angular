import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-product-output-list-mobile",
  templateUrl: "./product-output-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelDelete,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class ProductOutputListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isSuperUsuario = input<boolean>(false);

  edit = output<any>();
  returnProduct = output<any>();
  delete = output<string>();
}
