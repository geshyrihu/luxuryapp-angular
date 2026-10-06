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
import { EmployeeBeneficiaryForm } from "./employee-beneficiary-form";
import { EmployeeBeneficiaryListDesktop } from "./desktop/employee-beneficiary-list-desktop";
import { IEmployeeBeneficiary } from "./interfaces/employee-beneficiary.interface";
import { EmployeeBeneficiaryListMobile } from "./mobile/employee-beneficiary-list-mobile";

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "employee-beneficiary-list",
  templateUrl: "./employee-beneficiary-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EmployeeBeneficiaryListDesktop, EmployeeBeneficiaryListMobile],
})
export class EmployeeBeneficiaryList {
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  isReadOnly = input<boolean>(false);
  private readonly employeeInternalS = inject(EmployeeInternalService);
  private readonly dialogHandlerS = inject(DialogHandlerService);

  employeeId = input.required<string>();

  dataSignal = signal<IEmployeeBeneficiary[]>([]);
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
    this.employeeInternalS.getBeneficiaries(employeeId).then((result) => {
      this.dataSignal.set(result ?? []);
      this.loading.set(false);
    });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        EmployeeBeneficiaryForm,
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

      "¿Está seguro de eliminar este beneficiario?",

    );

    if (!confirmed) return;
    this.employeeInternalS.deleteBeneficiary(id).then((result: boolean) => {
      if (result) {
        this.dataSignal.update((items) =>
          items.filter((item) => item.id !== id),
        );
      }
    });
  }
}
