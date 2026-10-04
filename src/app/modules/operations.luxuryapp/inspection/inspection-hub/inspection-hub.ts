import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { LxCard } from "@ui/adaptive/card/card";
import { LxWidgetCard } from "@ui/adaptive/widget-card/widget-card";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { InspectionModuleGroup } from "./inspection-module.model";
import { INSPECTION_MODULES } from "./inspection-modules";

@Component({
  selector: "app-inspection-hub",
  imports: [AppIcon, LxCard, LxWidgetCard, MobileListItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./inspection-hub.html",
})
export class InspectionHub {
  private router = inject(Router);

  getVisibleGroups(): InspectionModuleGroup[] {
    return INSPECTION_MODULES;
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
