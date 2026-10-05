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
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { EquipmentContentListDesktop } from "./desktop/equipment-content-list-desktop";
import { EquipmentContentForm } from "./equipment-content-form";
import { EquipmentContentDto } from "./interfaces/equipment-content.dto";
import { EquipmentContentsDialogData } from "./interfaces/equipment-content.interface";
import { EquipmentContentListMobile } from "./mobile/equipment-content-list-mobile";

@Component({
  selector: "app-equipment-content-list",
  templateUrl: "./equipment-content-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EquipmentContentListDesktop, EquipmentContentListMobile],
})
export class EquipmentContentsList implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly config = inject(DynamicDialogConfig);
  readonly aspRoleS = inject(AspRoleService);
  platformS = inject(PlatformService);

  readonly ApplicationRole = ApplicationRole;
  readonly data = signal<EquipmentContentDto[]>([]);
  readonly loading = signal(true);
  readonly globalFilterFields = () => globalFilterFields(this.data());
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
