import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { SelectModule } from "primeng/select";
import { TooltipModule } from "primeng/tooltip";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ActivosForm } from "src/app/features/maintenance/equipos-y-maquinaria/machinery-asset/activos-form";
import { FichaTecnicaActivo } from "src/app/features/maintenance/equipos-y-maquinaria/machinery/ficha-tecnica-activo";
import { ServiceHistoryMachinery } from "src/app/features/maintenance/equipos-y-maquinaria/machinery/service-history-machinery";
import { BitacoraIndividual } from "src/app/features/maintenance/logs/maintenance-log/bitacora-individual";
@Component({
  selector: "app-inventory-engine-system",
  templateUrl: "./inventory-engine-system.html",
  imports: [
    CommonModule,
    CardModule,
    SelectModule,
    TooltipModule,
    CustomButton,
  ],
})
export class InventoryEngineSystem {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  // Declaración e inicialización de variables
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  filteredDataSignal = signal<any[]>([]); // Usar signal para datos filtrados

  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `InventoryEngineSystem/List/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result);
      this.filteredDataSignal.set(result);
    });
  }

  showModalFichatecnica(data: any) {
    this.dialogHandlerS
      .openDialog(
        FichaTecnicaActivo,
        data,
        "Ficha Técnica",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onBitacoraIndividual(machineryId: any) {
    this.dialogHandlerS.openDialog(
      BitacoraIndividual,
      {
        machineryId: machineryId,
      },
      "",
      this.dialogHandlerS.sizeFull,
    );
  }
  onServiceHistory(id: any) {
    this.dialogHandlerS.openDialog(
      ServiceHistoryMachinery,
      {
        id: id,
      },
      "",
      this.dialogHandlerS.sizeFull,
    );
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ActivosForm,
        {
          id: data.id,
          paramId: 1,
          inventoryCategory: data.inventoryCategoryId,
        },
        data.title,
        this.dialogHandlerS.sizeFull,
      )
      .then((result: any) => {
        if (result) this.onLoadData();
      });
  }

  // Mótodo para filtrar los datos por sistema
  onFilterForSystem(system: string) {
    if (system === "") {
      // Si el valor es vacío, mostrar todos
      this.showAll();
    } else {
      // Filtra los datos basados en el sistema seleccionado
      this.filteredDataSignal.set(
        this.dataSignal().filter((item) => item.system === system),
      );
    }
  }

  showAll() {
    // Restaura los datos originales
    this.filteredDataSignal.set([...this.dataSignal()]);
  }
}


