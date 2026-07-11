import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Type,
} from "@angular/core";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { ApplicationRole } from "src/app/core/interfaces/asp-net-roles.enum";
import { MiEdificio } from "src/app/apps/operations.luxuryapp/properties/mi-edificio/mi-edificio";
import { DashboardPendingItems } from "./dashboard-pending-items";
@Component({
  selector: "app-container-dashboard",
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./container-dashboard.html",
})
export class ContainerDashboard {
  private aspRoleS = inject(AspRoleService);
  // Computed signal to determine which component to render
  public componentToRender = computed<Type<any>>(() => {
    // If user has Client-specific roles, show MiEdificio
    if (
      this.aspRoleS.hasAny([
        ApplicationRole.Condomino,
        ApplicationRole.Comite,
      ])
    ) {
      return MiEdificio;
    }

    // Default fallback: The new Pending Items Dashboard
    return DashboardPendingItems;
  });
}
