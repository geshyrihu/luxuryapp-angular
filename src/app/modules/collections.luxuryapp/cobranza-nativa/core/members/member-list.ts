import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DateService } from "@core/services/date.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { EnumSelectService } from "@core/services/enum-select.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { PropertyMemberResponseDTO } from "../../interfaces/property-member.dto";

@Component({
  selector: "app-member-list",
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    LxTag,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    PrimeNgCustomCaption,
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

  tablePrimeNgRows = tablePrimeNgRows();
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
        .openDialog(m.default, data, data.title, this.dialogHandlerS.sizeLg)
        .then((res: boolean) => {
          if (res) this.onLoadData();
        });
    });
  }

  async onDeleteMember(item: PropertyMemberResponseDTO) {
    const res = await this.apiResponseS.onDelete(
      Endpoints.CobranzaCore.PropertyMembers.delete(item.id),
    );
    if (res) this.onLoadData();
  }

  async onEndMembership(item: PropertyMemberResponseDTO) {
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

