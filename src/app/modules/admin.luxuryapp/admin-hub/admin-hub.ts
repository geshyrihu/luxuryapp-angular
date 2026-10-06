import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxWidgetCard } from "@ui/adaptive/widget-card/widget-card";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AdminModuleGroup } from "./interfaces/admin-module-group.interface";
import { ADMIN_MODULES } from "./admin-modules";

@Component({
  selector: "app-admin-hub",
  imports: [LxIcon, LxWidgetCard, MobileListItem],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./admin-hub.html",
})
export class AdminHub {
  private router = inject(Router);
  private aspRoleS = inject(AspRoleService);

  getVisibleGroups(): AdminModuleGroup[] {
    return ADMIN_MODULES.filter((group) => {
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
