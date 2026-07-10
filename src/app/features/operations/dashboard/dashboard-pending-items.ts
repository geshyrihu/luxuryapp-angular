import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { UnifiedPendingDashboard } from "./unified-pending-dashboard";
import { UnifiedPendingDashboardMobile } from "./unified-pending-dashboard-mobile";
@Component({
  selector: "app-dashboard-pending-items",
  imports: [UnifiedPendingDashboard, UnifiedPendingDashboardMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <!-- Desktop View -->
    <div class="hidden md:block">
      <app-unified-pending-dashboard [visibleModules]="visibleModules()" />
    </div>

    <!-- Mobile View -->
    <div class="block md:hidden">
      <app-unified-pending-dashboard-mobile
        [visibleModules]="visibleModules()"
      />
    </div>
  `,
})
export class DashboardPendingItems {
  private aspRoleS = inject(AspRoleService);
  showMinutes = this.aspRoleS.anyOf([
    EApplicationRole.SuperUsuario,
    EApplicationRole.Administrador,
    EApplicationRole.GerenteOperaciones,
    EApplicationRole.GerenteAtencion,
    EApplicationRole.Asistente,
  ]);

  showTickets = computed(() => true);

  showMaintenance = this.aspRoleS.anyOf([
    EApplicationRole.SuperUsuario,
    EApplicationRole.Direccion,
    EApplicationRole.GerenteMantenimiento,
    EApplicationRole.JefeMantenimiento,
    EApplicationRole.Administrador,
  ]);

  showLegal = this.aspRoleS.anyOf([
    EApplicationRole.SuperUsuario,
    EApplicationRole.Legal,
  ]);

  showRecruitment = this.aspRoleS.anyOf([
    EApplicationRole.SuperUsuario,
    EApplicationRole.Reclutamiento,
  ]);

  showLegalStatus = this.aspRoleS.anyOf([
    EApplicationRole.SuperUsuario,
    EApplicationRole.Administrador,
    EApplicationRole.GerenteOperaciones,
    EApplicationRole.GerenteAtencion,
    EApplicationRole.Asistente,
  ]);

  showPolicies = this.aspRoleS.anyOf([
    EApplicationRole.SuperUsuario,
    EApplicationRole.Legal,
  ]);

  // Computed signal to pass allowed modules to the unified dashboard
  visibleModules = computed(() => {
    const modules: string[] = [];
    if (this.showMinutes()) modules.push("Minutas");
    if (this.showTickets()) modules.push("Tickets");
    if (this.showMaintenance()) modules.push("Mantenimiento");
    if (this.showLegal()) modules.push("Legal");
    if (this.showPolicies()) modules.push("Polizas");

    // Logic for other modules that were in tabs but now mapped to 'PendingItemDTO' modules
    // Reclutamiento? Not explicitly implemented in Backend yet but let's add it in case.
    if (this.showRecruitment()) modules.push("Reclutamiento");

    return modules;
  });
}
