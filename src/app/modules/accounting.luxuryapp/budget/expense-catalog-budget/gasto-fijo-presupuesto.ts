import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputNumberSignal } from "@ui/inputs/web/lux-input-number-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";

import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { LxSpinner } from "@ui/adaptive/spinner/spinner";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

import { LxMessage } from "@ui/adaptive/message/message";

@Component({
  selector: "app-gasto-fijo-presupuesto",
  templateUrl: "./gasto-fijo-presupuesto.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ButtonWeb,
    CommonModule,
    FormsModule,
    AppTable,
    LuxInputSelectSignal,
    LuxInputNumberSignal,
    LxSpinner,
    LuxTableCaption,
    TableFooter,
    LxMessage,
  ],
})
export class GastoFijoPresupuesto implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  confirmS = inject(ConfirmService);
  submitting = signal(false);

  intYear: number = new Date().getFullYear();
  availableYears: number[] = [2024, 2025, 2026];
  cb_availableYears: SelectItemDto[] = [];

  dataSignal = signal<any[]>([]);
  presupuestoAgregados = signal<any[]>([]); // Refactor also this to signal as it seems used in view
  total: number = 0;
  catalogoGastosFijosId: string = this.config.data.catalogoGastosFijosId;
  cb_cedulas: any[] = [];
  cedulaId: string = "";

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  ngOnInit(): void {
    this.cb_availableYears = this.availableYears.map((year) => ({
      label: year.toString(),
      value: year,
    }));
    this.onLoadCedulas();
    this.onLoadPresupuesto();
    this.onLoadPresupuestoAgregados();
  }

  onLoadPresupuesto() {
    const urlApi =
      Endpoints.CatalogoGastosFijosPresupuesto.fixedExpensesCatalog(
        this.customerIdS.customerId(),
        this.intYear,
        this.catalogoGastosFijosId,
      );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onSubmit(item: any) {
    const model = {
      accountName: item.accountName,
      accountNumber: item.accountNumber,
      amount: item.amount,
      fiscalYear: item.fiscalYear,
      catalogoGastosFijosId: this.catalogoGastosFijosId,
    };

    const urlApi = Endpoints.CatalogoGastosFijosPresupuesto.create;
    this.apiResponseS.onPost(urlApi, model).then(() => {
      this.onLoadPresupuestoAgregados();
      this.onLoadPresupuesto();
    });
  }

  onLoadPresupuestoAgregados() {
    const urlApi = Endpoints.CatalogoGastosFijosPresupuesto.purchaseOrderBudget(
      this.catalogoGastosFijosId,
    );

    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.presupuestoAgregados.set(result);
    });
  }

  async deletePresupuestoAgregado(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.CatalogoGastosFijosPresupuesto.delete(id))
      .then(() => {
        this.onLoadPresupuesto();
        this.onLoadPresupuestoAgregados();
      });
  }

  onUpdatePresupuestoAgregado(item: any) {
    this.apiResponseS
      .onPut(Endpoints.CatalogoGastosFijosPresupuesto.update(item.id), item)
      .then(() => {
        this.onLoadPresupuestoAgregados();
      });
  }

  onLoadCedulas() {
    const urlApi =
      Endpoints.CatalogoGastosFijosPresupuesto.fixedExpensesCatalog(
        this.customerIdS.customerId(),
        this.intYear,
        this.catalogoGastosFijosId,
      );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}
