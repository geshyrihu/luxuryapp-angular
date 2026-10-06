import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { PolicyContractListDesktop } from "./desktop/policy-contract-list-desktop";
import { PolicyContractListMobile } from "./mobile/policy-contract-list-mobile";
import { PolicyContractForm } from "./policy-contract-form";

@Component({
  selector: "app-policy-contract-list",
  templateUrl: "./policy-contract-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PolicyContractListDesktop, PolicyContractListMobile],
})
export class PolicyContractList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  dataSignal = signal<any[]>([]);
  groupedData: any = {};

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  isCurrent: boolean = true;

  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData(this.isCurrent);
      }
    });
  }

  groupData(data: any[]): any {
    const grouped: any = {};
    for (const item of data) {
      const groupName = item.typeOfContract;
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(item);
    }
    return grouped;
  }

  onLoadData(isCurrent: boolean = true) {
    const urlApi = Endpoints.PolicyContracts.list(
      this.customerIdS.customerId(),
      isCurrent,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      const mappedData = result.map((item) => ({ ...item, visible: true }));
      this.dataSignal.set(mappedData);
      this.groupedData = this.groupData(mappedData);
    });
  }

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta póliza/contrato?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.PolicyContracts.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PolicyContractForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.isCurrent);
      });
  }
  async onDeleteDocument(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este documento?",
    );
    if (!confirmed) return;
    const urlApi = Endpoints.PolicyContracts.deleteDocument(id);
    this.apiResponseS.onGetItem(urlApi).then(() => {
      this.onLoadData();
    });
  }

  onSelectActive(isCurrent: boolean): any {
    this.isCurrent = isCurrent;
    this.onLoadData(isCurrent);
  }
}
