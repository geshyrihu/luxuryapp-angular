import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { CONTABILIDAD_MODULES } from "./contabilidad-modules";
import { ContabilidadModuleGroup } from "./models/contabilidad-module.model";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-master-dashboard",
  imports: [CardModule],
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
