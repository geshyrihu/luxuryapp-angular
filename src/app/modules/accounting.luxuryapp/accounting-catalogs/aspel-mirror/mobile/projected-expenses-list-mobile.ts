import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-projected-expenses-list-mobile",
  templateUrl: "./projected-expenses-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    DecimalPipe,
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    DataViewMobile,
  ],
})
export class ProjectedExpensesListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  modal = output<any>();
  delete = output<string>();
}
