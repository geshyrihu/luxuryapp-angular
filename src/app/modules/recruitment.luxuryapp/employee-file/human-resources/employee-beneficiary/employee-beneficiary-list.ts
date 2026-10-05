import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { EmployeeBeneficiaryListDesktop } from "./desktop/employee-beneficiary-list-desktop";
import { EmployeeBeneficiaryFormComponent } from "./employee-beneficiary-form";
import { EmployeeBeneficiaryDTO } from "./interfaces/employee-beneficiary.interfaces";
import { EmployeeBeneficiaryListMobile } from "./mobile/employee-beneficiary-list-mobile";

@Component({
  selector: "app-employee-beneficiary-list",
  templateUrl: "./employee-beneficiary-list.html",

  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EmployeeBeneficiaryListDesktop, EmployeeBeneficiaryListMobile],
})
export class EmployeeBeneficiaryList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<EmployeeBeneficiaryDTO[]>([]);
  loading = signal(true);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<EmployeeBeneficiaryDTO[]>(
        Endpoints.HR.EmployeeBeneficiary.getAll(this.customerIdS.customerId()),
      )
      .then((result) => {
        if (result) this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        EmployeeBeneficiaryFormComponent,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.HR.EmployeeBeneficiary.delete(id))
      .then((success) => {
        if (success) {
          this.dataSignal.update((curr) => curr.filter((x) => x.id !== id));
        }
      });
  }
}
