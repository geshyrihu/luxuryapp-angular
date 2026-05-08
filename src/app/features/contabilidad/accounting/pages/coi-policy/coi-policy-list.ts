import { DatePipe, DecimalPipe } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { documentOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import {
  PagedResultDTO,
  PaginationCommonDTO,
} from "src/app/shared/models/pagination-common.dto";
import { CoiPolicyResponseDTO } from "./models/coi-policy.dto";

@Component({
  selector: "app-list-coi-policy",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    CustomButtonEdit,
    CustomButtonDelete,
    DatePipe,
    DecimalPipe,
    DataViewMobile,
    ActionMenu,
    IonButtonEdit,
    IonButtonDelete,
    IonItem,
    IonLabel,
    IonIcon,
  ],
  templateUrl: "./coi-policy-list.html",
})
export default class CoiPolicyList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  // PrimeNG Constants
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  // States
  dataSignal = signal<CoiPolicyResponseDTO[]>([]);
  totalRecords = signal(0);
  dtFilter = signal<PaginationCommonDTO>({
    filter: "",
    sort: "",
    page: 1,
    recordsNumber: this.tablePrimeNgRows,
  });

  constructor() {
    addIcons({ documentOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    const result = await this.apiResponseS.onPostPaged<
      PagedResultDTO<CoiPolicyResponseDTO>
    >(`coi-policies/paginated/${customerId}`, this.dtFilter());
    if (result && result.data) {
      this.dataSignal.set(result.data.items);
      this.totalRecords.set(result.data.totalRecords);
    } else {
      this.dataSignal.set([]);
      this.totalRecords.set(0);
    }
  }

  onLazyLoad(event: any) {
    if (event.first !== undefined && event.rows !== undefined) {
      this.dtFilter.update((f) => ({
        ...f,
        page: event.first / event.rows + 1,
        recordsNumber: event.rows,
        filter: event.globalFilter || "",
      }));
      this.onLoadData();
    }
  }

  onModalForm(id: string = "") {
    // const data = {
    //   id,
    //   title: id === '' ? 'Nueva Póliza' : 'Editar Póliza',
    //   customerId: this.customerIdS.customerId()
    // };
    // this.dialogHandlerS
    //   .openDialog(CoiPolicyForm, data, data.title, this.dialogHandlerS.sizeLg)
    //   .then((res: boolean) => {
    //     if (res) this.onLoadData();
    //   });
  }

  async onDelete(policy: CoiPolicyResponseDTO) {
    this.apiResponseS.onDelete(`coi-policies/${policy.id}`).then((res) => {
      if (res) this.onLoadData();
    });
  }
}
