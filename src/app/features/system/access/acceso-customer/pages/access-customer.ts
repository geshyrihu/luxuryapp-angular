import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { IAddCustomerPermisoToUser } from "src/app/core/interfaces/add-customer-permiso-to-user.interface";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
@Component({
  selector: "app-access-customer",
  templateUrl: "./access-customer.html",
  imports: [CommonModule, CardModule, AppIcon],
})
export class AccessCustomer implements OnInit {
  customToastService = inject(CustomToastService);
  apiResponseS = inject(ApiResponseService);
  dataSignal = signal<IAddCustomerPermisoToUser[]>([]);
  applicationUserId = input<string>("");

  ngOnInit(): void {
    this.onGetAccesCustomer();
  }

  onGetAccesCustomer() {
    this.apiResponseS
      .onGetList(Endpoints.AccesoCustomers.getByUser(this.applicationUserId()))
      .then((result: any[]) => {
        this.dataSignal.set(result);
      });
  }

  onUpdateAcceso(roles: any) {
    this.apiResponseS.onPost(
      Endpoints.AccesoCustomers.addToUser(this.applicationUserId()),
      roles,
    );
  }

  toggleCliente(item: IAddCustomerPermisoToUser): void {
    this.dataSignal.update((current) => {
      return current.map((c) => {
        if (c.customerId === item.customerId) {
          return { ...c, isSelected: !c.isSelected };
        }
        return c;
      });
    });
    this.onUpdateAcceso(this.dataSignal());
  }
}









