import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-maintenance-reports-mobile",
  templateUrl: "./maintenance-reports-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataViewMobile, MobileListItem, LxIcon],
})
export class MaintenanceReportsMobile {
  data = input.required<any[]>();
}
