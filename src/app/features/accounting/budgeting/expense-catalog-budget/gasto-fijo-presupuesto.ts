import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputNumberModule } from "primeng/inputnumber";
import { MessageModule } from "primeng/message";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-gasto-fijo-presupuesto",
  templateUrl: "./gasto-fijo-presupuesto.html",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CustomButton,
    MessageModule,
    CustomInputSelectSignal,
    InputNumberModule,
    ProgressSpinnerModule,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
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
  cb_availableYears: ISelectItem[] = [];

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
    const urlApi = `presupuesto/fixed-expenses-catalog/${this.customerIdS.customerId()}/${
      this.intYear
    }`;
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

    const urlApi = "CatalogoGastosFijosPresupuesto";
    this.apiResponseS.onPost(urlApi, model).then(() => {
      this.onLoadPresupuestoAgregados();
      this.onLoadPresupuesto();
    });
  }

  onLoadPresupuestoAgregados() {
    const urlApi = `CatalogoGastosFijosPresupuesto/PresupuestoOrdenCompraFijos/${this.catalogoGastosFijosId}`;

    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.presupuestoAgregados.set(result);
    });
  }

  deletePresupuestoAgregado(id: any) {
    this.apiResponseS
      .onDelete(`CatalogoGastosFijosPresupuesto/${id}`)
      .then(() => {
        this.onLoadPresupuesto();
        this.onLoadPresupuestoAgregados();
      });
  }

  onUpdatePresupuestoAgregado(item: any) {
    this.apiResponseS
      .onPut(`CatalogoGastosFijosPresupuesto/${item.id}`, item)
      .then(() => {
        this.onLoadPresupuestoAgregados();
      });
  }

  onLoadCedulas() {
    const urlApi = `presupuesto/fixed-expenses-catalog/${this.customerIdS.customerId()}/${
      this.intYear
    }`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}
