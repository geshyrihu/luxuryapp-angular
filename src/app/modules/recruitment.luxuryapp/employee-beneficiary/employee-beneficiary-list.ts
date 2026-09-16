import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";

import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { globalFilterFields } from "@core/helpers/table-primeng-option";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { EmployeeInternalService } from "@recruitment.luxuryapp/employee/employee-internal.service";
import { EmployeeBeneficiaryForm } from "./employee-beneficiary-form";
import { IEmployeeBeneficiary } from "./interfaces/employee-beneficiary.interface";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "employee-beneficiary-list",
  templateUrl: "./employee-beneficiary-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    WebButtonIcon,
    WebButtonIconConfirm,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    PrimeNgCustomCaption,
    DataViewMobile,
  ],
})
export class EmployeeBeneficiaryList {
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

  onDelete(id: string) {
    this.employeeInternalS.deleteBeneficiary(id).then((result: boolean) => {
      if (result) {
        this.dataSignal.update((items) =>
          items.filter((item) => item.id !== id),
        );
      }
    });
  }
}


