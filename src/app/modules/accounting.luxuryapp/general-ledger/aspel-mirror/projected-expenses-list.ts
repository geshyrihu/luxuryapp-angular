import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ProjectedExpensesListDesktop } from "./desktop/projected-expenses-list-desktop";
import { ProjectedExpensesListMobile } from "./mobile/projected-expenses-list-mobile";
import { ProjectedExpensesForm } from "./projected-expenses-form";

@Component({
  selector: "app-projected-expenses-list",
  templateUrl: "./projected-expenses-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProjectedExpensesListDesktop, ProjectedExpensesListMobile],
})
export default class ProjectedExpensesList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);
  ref: DynamicDialogRef;
  loading = signal(true);

  constructor() {
    effect(() => {
      this.onLoadData();
    });
  }

  /*
  /PRIME NG TABLE OPTIONS
  */
  // óEsta es la magia!
  // Se recalcularó automóticamente SOLO si dataSignal cambia.
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList(
        Endpoints.ProjectedExpenses.list(this.customerIdS.customerId()),
      )
      .then((result: any) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(
        Endpoints.ProjectedExpenses.delete(this.customerIdS.customerId(), id),
      )
      .then((result: boolean) => {
        if (result)
          this.dataSignal.set(
            this.dataSignal().filter((item) => item.id !== id),
          );
      });
  }

  onModal(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProjectedExpensesForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
