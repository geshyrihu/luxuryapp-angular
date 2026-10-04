import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { EndpointsMantenimiento } from "@core/constants/endpoints/mantenimiento.endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
} from "@core/services/dialog-handler.service";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { AppImage } from "@ui/web/image/image";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import { EquipmentContentForm } from "./equipment-content-form";
import { EquipmentContentDto } from "./interfaces/equipment-content.dto";
import { EquipmentContentsDialogData } from "./interfaces/equipment-content.interface";

@Component({
  selector: "app-equipment-content-list",
  templateUrl: "./equipment-content-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppImage,
    TableCaption,
    TableFooter,
    DataViewMobile,
    WebButtonIconDelete,
    WebButtonIconEdit,
    AppIcon,
  ],
})
export class EquipmentContentsList implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly config = inject(DynamicDialogConfig);
  readonly aspRoleS = inject(AspRoleService);

  readonly ApplicationRole = ApplicationRole;
  readonly data = signal<EquipmentContentDto[]>([]);
  readonly loading = signal(true);
  readonly globalFilterFields = () => globalFilterFields(this.data());
  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly contentManagementRoles = [
    ApplicationRole.JefeMantenimiento,
    ApplicationRole.Administrador,
    ApplicationRole.SuperUsuario,
  ];

  private equipmentId = "";
  equipmentName = "";

  canManageContents(): boolean {
    return this.aspRoleS.hasAny(this.contentManagementRoles);
  }

  ngOnInit(): void {
    const dialogData = this.config.data as EquipmentContentsDialogData;
    this.equipmentId = dialogData.equipmentId;
    this.equipmentName = dialogData.equipmentName;
    void this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    const result = await this.apiResponseS.onGetList<EquipmentContentDto[]>(
      EndpointsMantenimiento.EquipmentContents.byEquipment(this.equipmentId),
    );
    this.data.set(result ?? []);
    this.loading.set(false);
  }

  async onCreate(): Promise<void> {
    const result = await this.dialogHandlerS.openDialog(
      EquipmentContentForm,
      { id: null, equipmentId: this.equipmentId, title: "Nuevo contenido" },
      "Nuevo contenido",
      this.dialogHandlerS.sizeXl,
    );
    if (result) await this.loadData();
  }

  async onEdit(item: EquipmentContentDto): Promise<void> {
    const result = await this.dialogHandlerS.openDialog(
      EquipmentContentForm,
      {
        id: item.id,
        equipmentId: this.equipmentId,
        title: `Editar ${item.name}`,
      },
      "Editar contenido",
      this.dialogHandlerS.sizeXl,
    );
    if (result) await this.loadData();
  }

  async onDelete(id: string): Promise<void> {
    const deleted = await this.apiResponseS.onDelete(
      EndpointsMantenimiento.EquipmentContents.delete(id),
    );
    if (deleted) await this.loadData();
  }
}
