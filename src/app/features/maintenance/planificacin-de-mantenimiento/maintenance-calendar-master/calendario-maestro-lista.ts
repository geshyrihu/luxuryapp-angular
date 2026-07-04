import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { MenuItem } from "primeng/api";
import { DividerModule } from "primeng/divider";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Menu, MenuModule } from "primeng/menu";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import {
  WebButtonLabelDelete,
  WebButtonLabelEdit,
} from "src/app/core/components/buttons/web-label";
import { WebButtonLabelAdd } from "src/app/core/components/buttons/web-label/button-add";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label/button-item";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CalendarioMaestroForm } from "./calendario-maestro-form";
import { DatosServicioAddOrEdit } from "./datos-servicio-form";
import { MobileActionMenu } from "src/app/core/components/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "src/app/core/components/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "src/app/core/components/buttons/mobile-label/button-delete";

@Component({
  selector: "app-calendario-maestro-lista",
  templateUrl: "./calendario-maestro-lista.html",
  imports: [
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    DividerModule,
    WebButtonLabelAdd,
    WebButtonLabelItem,
    TooltipModule,
    MenuModule,
    TagModule,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
  ],
})
export class CalendarioMaestroLista implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = EApplicationRole;
  data = signal<any[]>([]);
  flatData = signal<any[]>([]);
  selectedItem = signal<any>(null);
  menuItems = signal<MenuItem[]>([]);
  ref: DynamicDialogRef;

  globalFilterFields = computed(() => {
    const data = this.flatData();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList("calendariomaestro/list")
      .then((result: any) => {
        const data = Array.isArray(result) ? result : [];
        this.data.set(data);
        const flattenedData = this.flattenData(data);
        this.flatData.set(flattenedData);
      });
  }

  flattenData(data: any[]): any[] {
    if (!Array.isArray(data)) return [];
    const flat = [];
    for (const month of data) {
      if (month && Array.isArray(month.items)) {
        for (const item of month.items) {
          flat.push({ ...item, month: month.month });
        }
      }
    }
    return flat;
  }

  onSelectItem(item: any, menu: Menu, event: any) {
    this.selectedItem.set(item);
    this.menuItems.set([
      {
        label: "Opciones",
        items: [
          {
            label: "Editar",
            icon: "mdi:pencil",
            command: () => this.onModalForm(item.id, item.eMonth),
          },
          {
            label: "Eliminar",
            icon: "mdi:delete",
            command: () => this.onDelete(item.id),
          },
        ],
      },
    ]);
    menu.toggle(event);
  }

  onDatosServicio(data: any) {
    this.dialogHandlerS.openDialog(
      DatosServicioAddOrEdit,
      data,
      "Información de servicio",
      this.dialogHandlerS.sizeLg,
    );
  }

  onDelete(id: any): void {
    this.apiResponseS
      .onDelete(`calendariomaestro/${id}`)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(); // Recargar los datos para reflejar el cambio
        }
      });
  }

  onModalForm(id: any, mes: number) {
    this.dialogHandlerS
      .openDialog(
        CalendarioMaestroForm,
        { id, mes },
        "Calendario Maestro",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
