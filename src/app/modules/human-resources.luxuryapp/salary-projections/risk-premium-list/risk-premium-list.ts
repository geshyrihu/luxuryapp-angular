import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { EndpointsAdmin } from "@core/constants/endpoints/admin.endpoints";
import { CustomerDto } from "../../../admin.luxuryapp/security-permissions/customer/interfaces/customer.dto";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-risk-premium-list",
  imports: [AppIcon, FormsModule, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./risk-premium-list.html",
})
export class RiskPremiumList implements OnInit {
  private readonly apiResponse = inject(ApiResponseService);

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
}
