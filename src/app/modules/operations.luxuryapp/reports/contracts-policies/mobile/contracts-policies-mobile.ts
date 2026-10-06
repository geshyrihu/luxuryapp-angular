import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-contracts-policies-mobile",
  templateUrl: "./contracts-policies-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataViewMobile,
    MobileListItem,
    MobileActionMenu],
})
export class ContractsPoliciesMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
}
