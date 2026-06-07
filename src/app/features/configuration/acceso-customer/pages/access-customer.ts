import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { IAddCustomerPermisoToUser } from "src/app/core/interfaces/add-customer-permiso-to-user.interface";
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
      .onGetList("AccesoCustomers/GetCustomers/" + this.applicationUserId())
      .then((result: any[]) => {
        this.dataSignal.set(result);
      });
  }

  onUpdateAcceso(roles: any) {
    this.apiResponseS.onPost(
      `AccesoCustomers/AddCustomerAccesoToUser/${this.applicationUserId()}`,
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









