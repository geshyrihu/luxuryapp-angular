import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Type,
} from "@angular/core";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { MiEdificio } from "src/app/features/operations/properties/mi-edificio/mi-edificio";
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
