import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DateService } from "@core/services/date.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { EnumSelectService } from "@core/services/enum-select.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonMobile } from "@ui/buttons/mobile";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { PropertyMemberResponseDTO } from "../../interfaces/property-member.dto";

@Component({
  selector: "app-member-list",
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    LxTag,
    ButtonWeb,
    MobileActionMenu,
    ButtonMobile,
    TableEmptyMessage,
    AppTable,
    LuxTableCaption,
    DataViewMobile,
    ApiDatePipe,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./member-list.html",
})
export default class MemberList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);
  private dialogHandlerS = inject(DialogHandlerService);
  private enumSelectS = inject(EnumSelectService);
  private confirmS = inject(ConfirmService);

  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  roleOptions = signal<SelectItemDto[]>([]);
  dataSignal = signal<PropertyMemberResponseDTO[]>([]);

  constructor() {
    this.enumSelectS
      .memberRole()
      .subscribe((opts) => this.roleOptions.set(opts));
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.apiResponseS
      .onGetItem<PropertyMemberResponseDTO[]>(
        Endpoints.CobranzaCore.PropertyMembers.byCustomer(customerId),
      )
      .then((res) => this.dataSignal.set(res ?? []));
  }

  onModalForm(id: string = "", propertyId: string = "") {
    const customerId = this.customerIdS.customerId();
    const data = {
      id,
      propertyId,
      customerId,
      title: id ? "Editar Miembro" : "Nuevo Miembro",
    };
    import("./member-form").then((m) => {
      this.dialogHandlerS
        .openDialog(m.default, data, data.title, this.dialogHandlerS.sizeXl)
        .then((res: boolean) => {
          if (res) this.onLoadData();
        });
    });
  }

  async onDeleteMember(item: PropertyMemberResponseDTO) {
    const confirmed = await this.confirmS.confirm(
      `¿Eliminar permanentemente la relación de ${item.userName} con esta propiedad? Solo se permitirá si no existen referencias históricas.`,
      "Eliminar relación",
    );
    if (!confirmed) return;
    const res = await this.apiResponseS.onDelete(
      Endpoints.CobranzaCore.PropertyMembers.delete(item.id),
    );
    if (res) this.onLoadData();
  }

  async onEndMembership(item: PropertyMemberResponseDTO) {
    const confirmed = await this.confirmS.confirm(
      "¿Confirma dar de baja a este miembro?",
      "Dar de baja",
    );
    if (!confirmed) return;
    const today = this.dateS.getDateFormat(new Date());
    const res = await this.apiResponseS.onPost(
      Endpoints.CobranzaCore.PropertyMembers.endMembership(item.id),
      { endDate: today ?? "", updatedBy: "operador" },
    );
    if (res) this.onLoadData();
  }

  rolLabel(role: number): string {
    return (
      this.roleOptions().find((o) => o.value === role)?.label ?? String(role)
    );
  }

  activeStatusMeta(isActive: boolean) {
    return isActive
      ? { label: "Activo", severity: "success" as const }
      : { label: "Baja", severity: "contrast" as const };
  }
}
