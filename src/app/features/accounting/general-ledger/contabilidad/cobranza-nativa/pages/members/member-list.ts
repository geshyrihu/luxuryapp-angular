import { DatePipe } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { IonBadge, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { peopleOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButton } from "src/app/core/components/buttons/web";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PropertyMemberResponseDTO } from "../../models/property-member.dto";

@Component({
  selector: "app-member-list",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    CustomButton,
    CustomButtonEdit,
    CustomButtonDelete,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
    IonBadge,
    DatePipe,
  ],
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

  roleOptions = signal<ISelectItem[]>([]);
  dataSignal = signal<PropertyMemberResponseDTO[]>([]);

  constructor() {
    addIcons({ peopleOutline });
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
      .onGetItem<
        PropertyMemberResponseDTO[]
      >(Endpoints.AccountingCoi.NativeCollection.PropertyMembers.byCustomer(customerId))
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

  async onDeleteUser(item: PropertyMemberResponseDTO) {
    const res = await this.apiResponseS.onDelete(
      Endpoints.ApplicationUsers.delete(item.userId),
    );
    if (res) this.onLoadData();
  }

  async onEndMembership(item: PropertyMemberResponseDTO) {
    const today = this.dateS.getDateFormat(new Date());
    const res = await this.apiResponseS.onPost(
      Endpoints.AccountingCoi.NativeCollection.PropertyMembers.endMembership(
        item.id,
      ),
      { endDate: today ?? "", updatedBy: "operador" },
    );
    if (res) this.onLoadData();
  }

  rolLabel(role: number): string {
    return (
      this.roleOptions().find((o) => o.value === role)?.label ?? String(role)
    );
  }
}
