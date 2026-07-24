import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";

import { LxSpinner } from "@ui/adaptive/spinner/spinner";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

import { LxMessage } from "@ui/adaptive/message/message";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-gasto-fijo-presupuesto",
  templateUrl: "./gasto-fijo-presupuesto.html",
  imports: [
    WebButtonIcon,
    WebButtonIconDelete,
    CommonModule,
    FormsModule,
    TableModule,
    WebButtonLabel,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    LxSpinner,
    WebButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    LxMessage,
  ],
})
export class GastoFijoPresupuesto implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
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
  tablePrimeNgRows: number = tablePrimeNgRows();
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
    const urlApi = Endpoints.CatalogoGastosFijosPresupuesto.fixedExpensesCatalog(
      this.customerIdS.customerId(),
      this.intYear,
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
    const urlApi =
      Endpoints.CatalogoGastosFijosPresupuesto.purchaseOrderBudget(
        this.catalogoGastosFijosId,
      );

    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.presupuestoAgregados.set(result);
    });
  }

  deletePresupuestoAgregado(id: any) {
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
    const urlApi = Endpoints.CatalogoGastosFijosPresupuesto.fixedExpensesCatalog(
      this.customerIdS.customerId(),
      this.intYear,
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}
