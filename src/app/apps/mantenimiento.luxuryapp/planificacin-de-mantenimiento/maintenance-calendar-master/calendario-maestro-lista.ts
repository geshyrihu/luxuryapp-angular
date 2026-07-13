import { Endpoints } from "src/app/core/constants/endpoints";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxMenu } from "@ui/adaptive/menu/menu";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MenuItem } from "primeng/api";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Menu } from "primeng/menu";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CalendarioMaestroForm } from "./calendario-maestro-form";
import { DatosServicioAddOrEdit } from "./datos-servicio-form";

@Component({
  selector: "app-calendario-maestro-lista",
  templateUrl: "./calendario-maestro-lista.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    LxDivider,
    WebButtonLabelAdd,
    WebButtonLabelItem,
    LxTooltipDirective,
    LxMenu,
    LxTag,
    DataViewMobile,
  ],
})
export class CalendarioMaestroLista implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;
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
      .onGetList(Endpoints.RefactorMantenimiento.calendariomaestroList)
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
          MobileListItem,
          AppIcon,
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
      .onDelete(Endpoints.RefactorMantenimiento.calendariomaestroById(id))
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
