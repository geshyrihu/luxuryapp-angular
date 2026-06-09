import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { ContabilidadModuleGroup } from "./contabilidad-module.model";
import { CONTABILIDAD_MODULES } from "./contabilidad-modules";

@Component({
  selector: "app-master-dashboard",
  imports: [CardModule, AppIcon],
  templateUrl: "./master-dashboard.html",
})
export class MasterDashboard {
  private router = inject(Router);

  getVisibleGroups(): ContabilidadModuleGroup[] {
    return CONTABILIDAD_MODULES;
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
