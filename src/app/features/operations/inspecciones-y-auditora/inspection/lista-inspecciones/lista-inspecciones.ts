import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { IonItem, IonLabel, IonText } from "@ionic/angular/standalone";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { TooltipModule } from "primeng/tooltip";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";
import { InspeccionesForm } from "../inspecciones-agregar-editar/inspecciones-form";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-lista-inspecciones",
  imports: [
    WebButtonIcon,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    CommonModule,
    FormsModule,
    CustomInputSelectSignal,
    WebButtonLabelItem,
    ActionMenu,
    RouterModule,
    TooltipModule,
    DataViewMobile,
    IonItem,
    IonLabel,
    IonText,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelItem,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./lista-inspecciones.html",
})
export class ListaInspecciones {
  readonly ROUTES = ROUTES;
  private router = inject(Router);
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

  navigateToReportes() {
    this.router.navigate(ROUTES.INSPECCIONES.LISTA_INFORMES);
  }

  navigateToDetalles(id: string) {
    this.router.navigate(ROUTES.INSPECCIONES.DETALLE(id));
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.Inspections.listByCustomer(this.customerIdS.customerId()),
      )
      .then((result: any) => {
        this.inspeccionesOriginalesSignal.set(result);

        const data: any[] = result;
        // Extraer óreas responsables del arreglo y eliminar duplicados
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
    this.apiResponseS
      .onDelete(Endpoints.Inspections.delete(id))
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  // Función para abrir un cuadro de diólogo modal para agregar o editar o crear
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
