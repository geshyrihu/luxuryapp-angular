import { CommonModule } from "@angular/common";
import { Component, computed, inject, Type } from "@angular/core";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { MiEdificio } from "src/app/features/tenant/mi-edificio/mi-edificio";
import { DashboardPendingItems } from "./dashboard-pending-items";
@Component({
  selector: "app-container-dashboard",
  imports: [CommonModule],
  templateUrl: "./container-dashboard.html",
})
export class ContainerDashboard {
  private aspRoleS = inject(AspRoleService);
  // Computed signal to determine which component to render
  public componentToRender = computed<Type<any>>(() => {
    // If user has Client-specific roles, show MiEdificio
    if (
      this.aspRoleS.hasAny([
        EApplicationRole.Condomino,
        EApplicationRole.Comite,
      ])
    ) {
      return MiEdificio;
    }

    // Default fallback: The new Pending Items Dashboard
    return DashboardPendingItems;
  });
}










