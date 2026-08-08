import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { LxCard } from "@ui/adaptive/card/card";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AdminModuleGroup } from "./admin-module.model";
import { ADMIN_MODULES } from "./admin-modules";

@Component({
  selector: "app-admin-wrapper",
  imports: [AppIcon, LxCard, MobileListItem],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./admin-wrapper.html",
})
export class AdminWrapper {
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