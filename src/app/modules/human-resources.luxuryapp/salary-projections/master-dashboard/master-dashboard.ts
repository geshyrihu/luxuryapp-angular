import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { LxCard } from "@ui/adaptive/card/card";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { EndpointsAdmin } from "@core/constants/endpoints/admin.endpoints";
import { CustomerDto } from "../../../admin.luxuryapp/security-permissions/customer/interfaces/customer.dto";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";

interface SalaryProjectionModuleOption {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

const MODULE_OPTIONS: SalaryProjectionModuleOption[] = [
  {
    title: "Propuestas salariales",
    description: "Crea, consulta y administra propuestas de ajuste salarial.",
    route: "/hr/salary-projections/proposals",
    icon: "material-symbols-light:request-quote",
    color: "#1d4ed8",
    backgroundColor: "#dbeafe",
  },
  {
    title: "Vacaciones federales",
    description: "Administra días de vacaciones por antigüedad y año.",
    route: "/hr/salary-projections/federal-vacation-parameters",
    icon: "material-symbols-light:beach-access",
    color: "#047857",
    backgroundColor: "#d1fae5",
  },
  {
    title: "ISN patronal por estado",
    description: "Administra porcentajes de ISN por estado y año.",
    route: "/hr/salary-projections/state-tax-parameters",
    icon: "material-symbols-light:account-balance",
    color: "#7c3aed",
    backgroundColor: "#ede9fe",
  },
  {
    title: "Parámetros LFT",
    description: "Administra aguinaldo y primas legales por año.",
    route: "/hr/salary-projections/federal-labor-law-parameters",
    icon: "material-symbols-light:gavel",
    color: "#b45309",
    backgroundColor: "#fef3c7",
  },
];

@Component({
  selector: "app-salary-projections-master-dashboard",
  imports: [AppIcon, LxCard, MobileListItem, FormsModule, NgClass],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./master-dashboard.html",
})
export class SalaryProjectionsMasterDashboard implements OnInit {
  private readonly router = inject(Router);
  private readonly apiResponse = inject(ApiResponseService);

  readonly options = MODULE_OPTIONS;
  customers = signal<CustomerDto[]>([]);
  updatingCustomerId = signal<string | null>(null);

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.apiResponse
      .onGetList<CustomerDto[]>(EndpointsAdmin.Customers.getAll(true))
      .then((res) => {
        if (res) {
          this.customers.set(res);
        }
      });
  }

  onUpdateRiskPremium(customer: CustomerDto) {
    if (customer.riskPremiumPercentage === null || customer.riskPremiumPercentage === undefined) return;
    
    this.updatingCustomerId.set(customer.id);
    this.apiResponse
      .onPut(EndpointsAdmin.Customers.updateRiskPremium(customer.id), customer.riskPremiumPercentage)
      .finally(() => {
        this.updatingCustomerId.set(null);
      });
  }

  navigateTo(route: string): void {
    void this.router.navigateByUrl(route);
  }
}
