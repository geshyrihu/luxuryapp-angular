import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonItem, IonLabel, IonText } from "@ionic/angular/standalone";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { InspeccionesForm } from "../inspecciones-agregar-editar/inspecciones-form";

@Component({
  selector: "app-lista-inspecciones",
  imports: [
    CommonModule,
    FormsModule,
    CustomButton,
    CustomInputSelectSignal,
    CustomButtonItem,
    ActionMenu,
    RouterModule,
    TooltipModule,
    DataViewMobile,
    IonItem,
    IonLabel,
    IonText,
    IonButtonEdit,
    IonButtonDelete,
    IonButtonItem,
  ],
  templateUrl: "./lista-inspecciones.html",
})
export class ListaInspecciones {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);

  areasResponsablesSignal = signal<ISelectItem[]>([]);
  inspeccionesOriginalesSignal = signal<any[]>([]);

  selectedAreaSignal = signal<string>("");
  selectedRecurrenceSignal = signal<string>("");

  inspeccionesFiltradasSignal = computed(() => {
    const original = this.inspeccionesOriginalesSignal();
    const area = this.selectedAreaSignal();
    const recurrence = this.selectedRecurrenceSignal();

    return original
      .map((group) => ({
        ...group,
        inspecciones: group.inspecciones.filter((inspeccion: any) => {
          const matchesArea = area === "" || group.areaResponsable === area;
          const matchesRecurrence =
            recurrence === "" || inspeccion.recurrencia === recurrence;
          return matchesArea && matchesRecurrence;
        }),
      }))
      .filter((group) => group.inspecciones.length > 0);
  });

  groupedData = computed(() => {
    const data = this.inspeccionesFiltradasSignal();
    const grouped: any = {};
    data.forEach((group) => {
      grouped[group.departament] = group.inspecciones;
    });
    return grouped;
  });

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.Inspections.listByCustomer(this.customerIdS.customerId()))
      .then((result: any) => {
      this.inspeccionesOriginalesSignal.set(result);

      const data: any[] = result;
      // Extraer áreas responsables del arreglo y eliminar duplicados
      const areas = [...new Set(data.map((item) => item.areaResponsable))];
      this.areasResponsablesSignal.set(
        areas.map((area: string) => ({
          label: area,
          value: area,
        })),
      );
    });
  }

  onDelete(id: string) {
    this.apiResponseS.onDelete(Endpoints.Inspections.delete(id)).then((result) => {
      if (result) this.onLoadData();
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        InspeccionesForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
