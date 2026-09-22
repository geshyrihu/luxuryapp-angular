import { ChangeDetectionStrategy, Component, inject, signal, effect, computed, untracked } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardMetricsFilters, DashboardMetricsFilter } from "./components/dashboard-metrics-filters";
import { DashboardMetricsService } from "./services/dashboard-metrics.service";
import { OperationalMetricsDTO } from "./interfaces/operational-metrics.dto";
import { MaintenanceOrdersByCategoryDto } from "./interfaces/maintenance-orders.dto";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { SwalService } from "@core/services/swal.service";

import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { AppIcon as AppIconComponent } from "@ui/shared/app-icon/app-icon";
import { AppIcon } from "@ui/shared/app-icon/app-icon.catalog";
import { MaintenanceCategoryCardComponent } from "./components/maintenance-category-card";
import { TicketsByGroupDTO } from "./interfaces/tickets-by-group.dto";
import { TicketsByGroupCardComponent } from "./components/tickets-by-group-card";
import { ContractsExpiringDTO } from "./interfaces/contracts-expiring.dto";
import { ContractTypeCardComponent } from "./components/contract-type-card";

@Component({
  selector: "app-dashboard-metrics",
  standalone: true,
  imports: [CommonModule, DashboardMetricsFilters, AppIconComponent, MaintenanceCategoryCardComponent, TicketsByGroupCardComponent, ContractTypeCardComponent],
  templateUrl: "./dashboard-metrics.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardMetrics {
  public appIconDef = AppIcon;
  private service = inject(DashboardMetricsService);
  private customerIdS = inject(CustomerIdService);
  private swalService = inject(SwalService);
  public aspRoleS = inject(AspRoleService);

  loading = signal<boolean>(false);
  metrics = signal<OperationalMetricsDTO | null>(null);
  hasError = signal<boolean>(false);

  maintenanceLoading = signal<boolean>(false);
  maintenanceMetrics = signal<MaintenanceOrdersByCategoryDto | null>(null);
  maintenanceHasError = signal<boolean>(false);

  ticketsLoading = signal<boolean>(false);
  ticketsMetrics = signal<TicketsByGroupDTO | null>(null);
  ticketsHasError = signal<boolean>(false);

  contractsLoading = signal<boolean>(false);
  contractsMetrics = signal<ContractsExpiringDTO | null>(null);
  contractsHasError = signal<boolean>(false);

  private currentFilter = signal<DashboardMetricsFilter | null>(null);

  isCorporate = computed(() => {
    return this.aspRoleS.anyOf([
      ApplicationRole.SuperUsuario,
      ApplicationRole.Direccion,
      ApplicationRole.Legal,
      ApplicationRole.CoordinacionLegal,
      ApplicationRole.RecursosHumanos,
      ApplicationRole.Reclutamiento,
      ApplicationRole.GerenteMantenimiento,
      ApplicationRole.SistemasGeneral,
      ApplicationRole.Mensajeria,
      ApplicationRole.SupervisionOperativa
    ]);
  });

  canViewOperational = computed(() => {
    return this.aspRoleS.anyOf([
      ApplicationRole.SuperUsuario,
      ApplicationRole.Direccion,
      ApplicationRole.Legal,
      ApplicationRole.CoordinacionLegal,
      ApplicationRole.RecursosHumanos,
      ApplicationRole.Reclutamiento,
      ApplicationRole.GerenteMantenimiento,
      ApplicationRole.SistemasGeneral,
      ApplicationRole.Mensajeria,
      ApplicationRole.SupervisionOperativa,
      ApplicationRole.Administrador,
      ApplicationRole.GerenteOperaciones,
      ApplicationRole.GerenteAtencion,
      ApplicationRole.Asistente,
      ApplicationRole.Contador,
      ApplicationRole.Cobranza,
      ApplicationRole.JefeMantenimiento
    ]);
  });

  canViewMaintenance = computed(() => {
    return this.aspRoleS.anyOf([
      ApplicationRole.GerenteMantenimiento,
      ApplicationRole.SupervisionOperativa,
      ApplicationRole.Administrador,
      ApplicationRole.GerenteOperaciones,
      ApplicationRole.GerenteAtencion,
      ApplicationRole.JefeMantenimiento,
      ApplicationRole.SuperUsuario,
      ApplicationRole.Direccion
    ]);
  });

  canViewTickets = computed(() => {
    return this.aspRoleS.anyOf([
      ApplicationRole.SuperUsuario,
      ApplicationRole.Direccion,
      ApplicationRole.GerenteMantenimiento,
      ApplicationRole.SupervisionOperativa,
      ApplicationRole.Administrador,
      ApplicationRole.GerenteOperaciones,
      ApplicationRole.GerenteAtencion,
      ApplicationRole.Asistente,
      ApplicationRole.Almacenista,
      ApplicationRole.Contador,
      ApplicationRole.Cobranza,
      ApplicationRole.JefeMantenimiento,
      ApplicationRole.TecnicoMantenimiento,
      ApplicationRole.MttoNocturno,
      ApplicationRole.Recepcionista,
      ApplicationRole.MasterConcierge,
      ApplicationRole.Concierge,
      ApplicationRole.JardineriaInterna,
      ApplicationRole.JefeSeguridadInterna,
      ApplicationRole.SeguridadInterna,
      ApplicationRole.Monitorista,
      ApplicationRole.EntrenadorGimnasio,
      ApplicationRole.SupervisorObra,
      ApplicationRole.Sistemas,
      ApplicationRole.Ludotecaria,
      ApplicationRole.Paqueteria,
      ApplicationRole.Chofer,
      ApplicationRole.BellBoy,
      ApplicationRole.SnackBar,
      ApplicationRole.Salvavidas,
      ApplicationRole.Jardineria,
      ApplicationRole.Limpieza,
      ApplicationRole.Proveedor
    ]);
  });

  canViewContracts = computed(() => {
    return this.aspRoleS.anyOf([
      ApplicationRole.Legal,
      ApplicationRole.SuperUsuario,
      ApplicationRole.Direccion,
      ApplicationRole.Administrador,
      ApplicationRole.GerenteOperaciones,
      ApplicationRole.GerenteAtencion,
      ApplicationRole.SupervisionOperativa,
      ApplicationRole.GerenteMantenimiento
    ]);
  });

  constructor() {
    effect(() => {
      // Metrics effect
      const sessionCid = this.customerIdS.customerId();
      const filter = this.currentFilter();
      if (filter) {
        this.loadMetrics(filter, sessionCid);
      }
    });

    effect(() => {
      // Maintenance effect
      const sessionCid = this.customerIdS.customerId();
      if (sessionCid && untracked(() => this.canViewMaintenance())) {
        this.loadMaintenanceMetrics(sessionCid);
      }
    });

    effect(() => {
      // Tickets effect
      const sessionCid = this.customerIdS.customerId();
      if (sessionCid && untracked(() => this.canViewTickets())) {
        const filter = untracked(() => this.currentFilter());
        const resolvedCustomerId = untracked(() => this.isCorporate()) ? (filter?.customerId || sessionCid) : sessionCid;
        this.loadTicketsMetrics(resolvedCustomerId, 0, 0);
      }
    });

    effect(() => {
      // Contracts effect
      const sessionCid = this.customerIdS.customerId();
      if (sessionCid && untracked(() => this.canViewContracts())) {
        this.loadContractsMetrics(sessionCid);
      }
    });
  }

  onFilterChange(filter: DashboardMetricsFilter) {
    this.currentFilter.set(filter);
  }

  async loadMetrics(filter: DashboardMetricsFilter, sessionCustomerId: string) {
    this.loading.set(true);
    this.hasError.set(false);
    this.metrics.set(null);
    try {
      const resolvedCustomerId = this.isCorporate() ? filter.customerId : sessionCustomerId;
      const data = await this.service.getOperationalMetrics(
        filter.fechaInicio,
        filter.fechaFin,
        resolvedCustomerId,
        filter.tipoOperacion
      );
      this.metrics.set(data);
    } catch (err) {
      this.hasError.set(true);
      this.swalService.error("Error", "No se pudieron cargar las métricas operativas");
    } finally {
      this.loading.set(false);
    }
  }

  async loadMaintenanceMetrics(sessionCustomerId: string) {
    if (!sessionCustomerId) return;
    
    this.maintenanceLoading.set(true);
    this.maintenanceHasError.set(false);
    this.maintenanceMetrics.set(null);
    try {
      const data = await this.service.getMaintenanceOrdersByCategory(sessionCustomerId);
      if (data === null) {
        this.maintenanceHasError.set(true);
      } else {
        this.maintenanceMetrics.set(data);
      }
    } catch (err) {
      this.maintenanceHasError.set(true);
    } finally {
      this.maintenanceLoading.set(false);
    }
  }

  async loadTicketsMetrics(customerId: string, month: number, year: number) {
    if (!customerId || !this.canViewTickets()) return;
    
    this.ticketsLoading.set(true);
    this.ticketsHasError.set(false);
    this.ticketsMetrics.set(null);
    try {
      const data = await this.service.getTicketsByGroup(customerId, month, year);
      if (data === null) {
        this.ticketsHasError.set(true);
      } else {
        this.ticketsMetrics.set(data);
      }
    } catch (err) {
      if (err && (err as any).status === 403) {
        // Forbidden, ignore
        this.ticketsHasError.set(false);
      } else {
        this.ticketsHasError.set(true);
      }
    } finally {
      this.ticketsLoading.set(false);
    }
  }

  async loadContractsMetrics(customerId: string) {
    if (!customerId || !this.canViewContracts()) return;
    
    this.contractsLoading.set(true);
    this.contractsHasError.set(false);
    this.contractsMetrics.set(null);
    try {
      const data = await this.service.getContractsExpiring(customerId);
      if (data === null) {
        this.contractsHasError.set(true);
      } else {
        this.contractsMetrics.set(data);
      }
    } catch (err) {
      if (err && (err as any).status === 403) {
        // Forbidden, ignore
        this.contractsHasError.set(false);
      } else {
        this.contractsHasError.set(true);
      }
    } finally {
      this.contractsLoading.set(false);
    }
  }
}
