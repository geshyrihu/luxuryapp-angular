import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { SupervisionModuleGroup } from "./supervision-module.model";
import { SUPERVISION_MODULES } from "./supervision-modules";

@Component({
  selector: "app-supervision-master-dashboard",
  imports: [CardModule, AppIcon],
  templateUrl: "./master-dashboard.html",
})
export class SupervisionMasterDashboard {
  private router = inject(Router);

  getVisibleGroups(): SupervisionModuleGroup[] {
    return SUPERVISION_MODULES;
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
