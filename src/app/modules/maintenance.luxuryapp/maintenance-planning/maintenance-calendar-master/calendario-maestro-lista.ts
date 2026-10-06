import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { MenuItem } from "@core/interfaces/menu-item.interface";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxMenu } from "@ui/adaptive/menu/menu";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { CalendarioMaestroForm } from "./calendario-maestro-form";
import { CalendarioMaestroListaDesktop } from "./desktop/calendario-maestro-lista-desktop";
import { DatosServicioAddOrEdit } from "./datos-servicio-form";
import { CalendarioMaestroListaMobile } from "./mobile/calendario-maestro-lista-mobile";

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-calendario-maestro-lista",
  templateUrl: "./calendario-maestro-lista.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxDivider,
    CalendarioMaestroListaDesktop,
    CalendarioMaestroListaMobile,
  ],
})
export class CalendarioMaestroLista implements OnInit {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  platformS = inject(PlatformService);
  public AspRole = ApplicationRole;
  data = signal<any[]>([]);
  flatData = signal<any[]>([]);
  selectedItem = signal<any>(null);
  menuItems = signal<MenuItem[]>([]);
  ref: DynamicDialogRef;

  readonly isSuperUsuario = this.aspRoleS.roleSignal(
    ApplicationRole.SuperUsuario,
  );

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

  onSelectItem(item: any, menu: LxMenu) {
    this.selectedItem.set(item);
    this.menuItems.set([
      {
        label: "Opciones",
        items: [
          {
            label: "Editar",
            icon: "material-symbols-light:edit",
            command: () => this.onModalForm(item.id, item.eMonth),
          },
          {
            label: "Eliminar",
            icon: "material-symbols-light:delete",
            command: () => this.onDelete(item.id),
          },
          MobileListItem,
          LxIcon,
        ],
      },
    ]);
    menu.toggle();
  }

  onDatosServicio(data: any) {
    this.dialogHandlerS.openDialog(
      DatosServicioAddOrEdit,
      data,
      "Información de servicio",
      this.dialogHandlerS.sizeXl,
    );
  }

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
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
