import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import type { SelectItemDto } from "@core/interfaces/select-item.dto";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { AppStatCard } from "@ui/shared/stat-card/stat-card";
import {
  CORPORATE_ROLES,
  KPI_CATALOG,
  KPI_GRUPOS,
  KpiConfig,
  REVIEW_ROLES,
  STAFF_ROLES,
} from "./kpi-catalog.config";

@Component({
  selector: "app-kpi-catalog",
  standalone: true,
  imports: [FormsModule, CustomInputSelectSignal, AppStatCard],
  templateUrl: "./kpi-catalog.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCatalog implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  readonly grupos = KPI_GRUPOS;
  readonly customerId = this.customerIdS.customerId;
  readonly customerName = this.customerIdS.customerName;

  readonly roleItems = signal<SelectItemDto<string>[]>([]);
  readonly selectedRole = signal<string>("");
  readonly roleLoadError = signal<boolean>(false);

  readonly roleOptions = computed(() =>
    this.roleItems().map((r) => ({
      value: r.value,
      label: r.group ? `${r.label} (${r.group})` : r.label,
    })),
  );

  readonly roleLabel = computed(
    () => this.roleOptions().find((r) => r.value === this.selectedRole())?.label ?? "",
  );

  readonly seesAllCustomers = computed(() => {
    const role = this.selectedRole();
    return CORPORATE_ROLES.includes(role) || REVIEW_ROLES.includes(role);
  });

  readonly isStaff = computed(() => STAFF_ROLES.includes(this.selectedRole()));
  readonly isReview = computed(() => REVIEW_ROLES.includes(this.selectedRole()));

  readonly scopeLabel = computed(() =>
    this.seesAllCustomers() ? "Todos los clientes" : this.customerName() || "Cliente seleccionado",
  );

  readonly visibleKpis = computed(() =>
    KPI_CATALOG.filter((k) => k.roles.includes(this.selectedRole())),
  );

  readonly plannedKpis = computed(() => KPI_CATALOG.filter((k) => k.roles.length === 0));

  ngOnInit(): void {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto<string>[]>(Endpoints.SelectItems.dashboardKpiRoles)
      .then((items) => {
        this.roleItems.set(items ?? []);
        if (!this.selectedRole() && items?.length) {
          this.selectedRole.set(items[0].value);
        }
      })
      .catch(() => {
        this.roleItems.set([]);
        this.roleLoadError.set(true);
      });
  }

  kpisByGrupo(grupo: string): KpiConfig[] {
    return this.visibleKpis().filter((k) => k.grupo === grupo);
  }

  sampleValue(kpi: KpiConfig): number {
    if (this.seesAllCustomers()) return kpi.valorMuestra;
    const seed = this.seed(this.customerId());
    if (kpi.formato === "percent" || kpi.sufijo) {
      return Math.round((kpi.valorMuestra + ((seed % 7) - 3) * 0.4) * 10) / 10;
    }
    const factor = 0.15 + (seed % 30) / 100;
    return Math.round(kpi.valorMuestra * factor);
  }

  private seed(text: string): number {
    let total = 0;
    for (let i = 0; i < text.length; i++) total += text.charCodeAt(i);
    return total;
  }
}
