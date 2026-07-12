import { CommonModule } from "@angular/common";
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
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "primeng/table";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EmployeeInternalService } from '../employee-internal/employee-internal.service';
import { IEmployeeBankData } from './interfaces/employee-bank-data.interface';
import { EmployeeBankDataForm } from "./employee-bank-data-form";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "employee-bank-data-list",
  templateUrl: "./employee-bank-data-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    WebButtonIcon,
    WebButtonIconConfirm,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    ],
})
export class EmployeeBankDataList {
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

  onDelete(id: string) {
    this.employeeInternalS.deleteBankData(id).then((result: boolean) => {
      if (result) {
        this.dataSignal.update((items) =>
          items.filter((item) => item.id !== id),
        );
      }
    });
  }
}
