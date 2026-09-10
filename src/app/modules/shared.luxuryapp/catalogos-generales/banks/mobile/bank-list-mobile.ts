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
import { BankDto } from "../interfaces/banks.dto";

@Component({
  selector: "app-bank-list-mobile",
  templateUrl: "./bank-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataViewMobile,
    MobileActionMenu,
    MobileButtonLabelDelete,
    MobileButtonLabelEdit,
    MobileListItem,
  ],
})
export class BankListMobile {
  data = input.required<BankDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
