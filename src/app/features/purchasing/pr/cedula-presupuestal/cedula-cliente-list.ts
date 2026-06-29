import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { walletOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { CustomButtonConfirm } from "src/app/core/components/web/buttons/custom-button-confirm";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenesCompraCedulaListComponent } from "./ordenes-compra-cedula-list";
import { PeriodoCedulaForm } from "./periodo-cedula-form";

@Component({
  selector: "app-cedula-cliente-list",
  templateUrl: "./cedula-cliente-list.html",
  imports: [
    EmptyState,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    TagModule,
    TooltipModule,
    PrimeNgCustomCaption,
    CustomButton,
    CustomButtonConfirm,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
  ],
})
export class CedulaClienteList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  cb_cedulas: ISelectItem[] = [];
  idControl = new FormControl<string>("");

  presupuestoMensual = 0;
  presupuestoAnual = 0;
  presupuestoEjercido = 0;
  presupuestoDisponible = 0;

  constructor() {
    addIcons({ walletOutline });
  }

  ngOnInit(): void {
    this.onLoadCedulas();
  }

  onLoadCedulas() {
    this.apiResponseS
      .onGetSelectItem(
        Endpoints.SelectItems.periodoPresupuestals(
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => {
        this.cb_cedulas = result;
      });
  }

  onReloadData(id: any) {
    this.idControl.setValue(id);
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.CedulaPresupuestal.list(this.idControl.value))
      .then((result: any) => {
        this.dataSignal.set(result);

        this.presupuestoMensual = this.dataSignal().reduce(
          (sum, current) => sum + current.presupuestoMensual,
          0,
        );
        this.presupuestoAnual = this.dataSignal().reduce(
          (sum, current) => sum + current.presupuestoAnual,
          0,
        );
        this.presupuestoEjercido = this.dataSignal().reduce(
          (sum, current) => sum + current.presupuestoEjercido,
          0,
        );
        this.presupuestoDisponible = this.dataSignal().reduce(
          (sum, current) => sum + current.presupuestoDisponible,
          0,
        );
      });
  }

  onModalAdd() {
    // Implement Add logic or remove if unused
  }

  editarPeriodo() {
    this.dialogHandlerS
      .openDialog(
        PeriodoCedulaForm,
        {
          id: this.idControl.value,
        },
        "Editar Periodo",
        this.dialogHandlerS.sizeSm,
      )
      .then((result: boolean) => {
        if (result) {
          // Refresh list logic
        }
      });
  }

  onModalEditar(data: any) {
    // Implement Edit logic
  }

  DownloadExcel() {
    // Implement Excel download
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.CedulaPresupuestal.delete(id))
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalOrdenesCompraCedula(id: any) {
    this.dialogHandlerS.openDialog(
      OrdenesCompraCedulaListComponent,
      {
        id: id,
      },
      "Ordenes de compra",
      this.dialogHandlerS.sizeLg,
    );
  }
}

