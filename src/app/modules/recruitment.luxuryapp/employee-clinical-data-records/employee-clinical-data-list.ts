import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";

import { globalFilterFields } from "@core/helpers/table-options";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { EmployeeInternalService } from "@recruitment.luxuryapp/employees/employee-internal.service";
import { EmployeeClinicalDataForm } from "./employee-clinical-data-form";
import { EmployeeClinicalDataListDesktop } from "./desktop/employee-clinical-data-list-desktop";
import { IEmployeeClinicalData } from "./interfaces/employee-clinical-data.interface";
import { EmployeeClinicalDataListMobile } from "./mobile/employee-clinical-data-list-mobile";

@Component({
  selector: "employee-clinical-data-list",
  templateUrl: "./employee-clinical-data-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EmployeeClinicalDataListDesktop, EmployeeClinicalDataListMobile],
})
export class EmployeeClinicalDataList {
  platformS = inject(PlatformService);
  isReadOnly = input<boolean>(false);
  private readonly employeeInternalS = inject(EmployeeInternalService);
  private readonly dialogHandlerS = inject(DialogHandlerService);

  employeeId = input.required<string>();

  dataSignal = signal<IEmployeeClinicalData[]>([]);
  loading = signal(false);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    return data.length > 0 ? globalFilterFields(data) : [];
  });

  constructor() {
    effect(() => {
      const employeeId = this.employeeId();
      if (employeeId) {
        this.onLoadData(employeeId);
      }
    });
  }

  onLoadData(employeeId = this.employeeId()) {
    this.loading.set(true);
    this.employeeInternalS.getClinicalData(employeeId).then((result) => {
      this.dataSignal.set(result ?? []);
      this.loading.set(false);
    });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        EmployeeClinicalDataForm,
        {
          id: data.id,
          employeeId: this.employeeId(),
        },
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onDelete(id: string) {
    this.employeeInternalS.deleteClinicalData(id).then((result: boolean) => {
      if (result) {
        this.dataSignal.update((items) =>
          items.filter((item) => item.id !== id),
        );
      }
    });
  }
}
