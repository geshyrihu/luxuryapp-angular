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
import { EmployeeBankDataFormComponent } from "./employee-bank-data-form";
import { EmployeeBankDataListDesktop } from "./desktop/employee-bank-data-list-desktop";
import { EmployeeBankDataDTO } from "./interfaces/employee-bank-data.interfaces";
import { EmployeeBankDataListMobile } from "./mobile/employee-bank-data-list-mobile";

@Component({
  selector: "app-employee-bank-data-list",
  templateUrl: "./employee-bank-data-list.html",

  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EmployeeBankDataListDesktop, EmployeeBankDataListMobile],
})
export class EmployeeBankDataList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<EmployeeBankDataDTO[]>([]);
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
      .onGetList<EmployeeBankDataDTO[]>(
        Endpoints.HR.EmployeeBankData.getAll(this.customerIdS.customerId()),
      )
      .then((result) => {
        if (result) this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        EmployeeBankDataFormComponent,
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
      .onDelete(Endpoints.HR.EmployeeBankData.delete(id))
      .then((success) => {
        if (success) {
          this.dataSignal.update((curr) => curr.filter((x) => x.id !== id));
        }
      });
  }
}
