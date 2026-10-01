import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { LxCard } from "@ui/adaptive/card/card";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { InspectionModuleGroup } from "./inspection-module.model";
import { INSPECTION_MODULES } from "./inspection-modules";

@Component({
  selector: "app-inspection-master-dashboard",
  imports: [AppIcon, LxCard, MobileListItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./inspection-master-dashboard.html",
})
export class InspectionMasterDashboard {
  private router = inject(Router);

  getVisibleGroups(): InspectionModuleGroup[] {
    return INSPECTION_MODULES;
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
