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
import { EmployeeBankDataForm } from "./employee-bank-data-form";
import { EmployeeBankDataListDesktop } from "./desktop/employee-bank-data-list-desktop";
import { IEmployeeBankData } from "./interfaces/employee-bank-data.interface";
import { EmployeeBankDataListMobile } from "./mobile/employee-bank-data-list-mobile";

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "employee-bank-data-list",
  templateUrl: "./employee-bank-data-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EmployeeBankDataListDesktop, EmployeeBankDataListMobile],
})
export class EmployeeBankDataList {
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  isReadOnly = input<boolean>(false);
  private readonly employeeInternalS = inject(EmployeeInternalService);
  private readonly dialogHandlerS = inject(DialogHandlerService);

  employeeId = input.required<string>();

  dataSignal = signal<IEmployeeBankData[]>([]);
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
    this.employeeInternalS.getBankData(employeeId).then((result) => {
      this.dataSignal.set(result ?? []);
      this.loading.set(false);
    });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        EmployeeBankDataForm,
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

  async onDelete(id: string) {

    const confirmed = await this.confirmS.confirm(

      "¿Está seguro de eliminar estos datos bancarios?",

    );

    if (!confirmed) return;
    this.employeeInternalS.deleteBankData(id).then((result: boolean) => {
      if (result) {
        this.dataSignal.update((items) =>
          items.filter((item) => item.id !== id),
        );
      }
    });
  }
}
