import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { IonItem, IonItemDivider, IonLabel, IonList } from "@ionic/angular/standalone";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { ContabilidadModuleGroup } from "./contabilidad-module.model";
import { CONTABILIDAD_MODULES } from "./contabilidad-modules";

@Component({
  selector: "app-master-dashboard",
  imports: [CardModule, AppIcon, IonList, IonItem, IonItemDivider, IonLabel],
  templateUrl: "./master-dashboard.html",
})
export class MasterDashboard {
  private router = inject(Router);
  private aspRoleS = inject(AspRoleService);

  getVisibleGroups(): ContabilidadModuleGroup[] {
    return CONTABILIDAD_MODULES.filter((group) => {
      if (!group.roles || group.roles.length === 0) return true;
      return this.aspRoleS.hasAny(group.roles);
    })
      .map((group) => ({
        ...group,
        cards: group.cards.filter((card) => {
          if (!card.roles || card.roles.length === 0) return true;
          return this.aspRoleS.hasAny(card.roles);
        }),
      }))
      .filter((group) => group.cards.length > 0);
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
