import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { addIcons } from "ionicons";
import { walletOutline } from "ionicons/icons";
import { TableModule } from "@ui/web/primeng-table/primeng-table";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenesCompraCedulaListComponent } from "./ordenes-compra-cedula-list";
import { PeriodoCedulaForm } from "./periodo-cedula-form";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-cedula-cliente-list",
  templateUrl: "./cedula-cliente-list.html",
  imports: [
    WebButtonIcon,
    WebButtonIconConfirm,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    LxTooltipDirective,
    PrimeNgCustomCaption,
    WebButtonLabel,
    WebButtonLabelConfirm,
    DataViewMobile,
    ActionMenu,
    MobileListItem,
    AppIcon,
    LxTag,
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

  cb_cedulas: SelectItemDto[] = [];
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
        Endpoints.SelectItems.fundingPeriod(this.customerIdS.customerId()),
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
