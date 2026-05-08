import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { MenuItem } from "primeng/api";
import { CustomButtonAdd } from "src/app/core/components/buttons/web/custom-button-add";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DividerModule } from "primeng/divider";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Menu, MenuModule } from "primeng/menu";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
  IonButtonDelete,
  IonButtonEdit,
} from "src/app/core/components/buttons/mobile";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CalendarioMaestroForm } from "./calendario-maestro-form";
import { DatosServicioAddOrEdit } from "./datos-servicio-form";
@Component({
  selector: "app-calendario-maestro-lista",
  templateUrl: "./calendario-maestro-lista.html",
  imports: [
    DividerModule,
    CustomButtonAdd,
    CustomButtonItem,
    TooltipModule,
    MenuModule,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
    IonButtonDelete,
    IonButtonEdit,
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
        this.data.set(result);
        const flattenedData = this.flattenData(result);
        this.flatData.set(flattenedData);
      });
  }

  flattenData(data: any[]): any[] {
    const flat = [];
    for (const month of data) {
      for (const item of month.items) {
        flat.push({ ...item, month: month.month });
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
            icon: "pi pi-fw pi-pencil",
            command: () => this.onModalForm(item.id, item.eMonth),
          },
          {
            label: "Eliminar",
            icon: "pi pi-fw pi-trash",
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
