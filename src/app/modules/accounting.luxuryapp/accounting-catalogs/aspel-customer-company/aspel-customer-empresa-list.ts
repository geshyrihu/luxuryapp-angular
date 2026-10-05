import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ETypeEmpresa } from "@ui/web/status-badge/status-badge";
import { AspelCustomerEmpresaForm } from "./aspel-customer-empresa-form";
import { AspelCustomerEmpresaListDesktop } from "./desktop/aspel-customer-empresa-list-desktop";
import { AspelCustomerEmpresaListMobile } from "./mobile/aspel-customer-empresa-list-mobile";

@Component({
  selector: "app-aspel-customer-empresa-list",
  templateUrl: "./aspel-customer-empresa-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AspelCustomerEmpresaListDesktop, AspelCustomerEmpresaListMobile],
})
export class AspelCustomerEmpresaList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdService = inject(CustomerIdService);
  platformS = inject(PlatformService);

  dataSignal = signal<any[]>([]);
  customerId = this.customerIdService.customerId;
  ETypeEmpresa = ETypeEmpresa;

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.AspelCustomerEmpresa.getAll)
      .then((res: any) => this.dataSignal.set(res));
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        AspelCustomerEmpresaForm,
        { ...data, customerId: this.customerId() },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.AspelCustomerEmpresa.delete(id))
      .then((res: any) => {
        if (res) this.onLoadData();
      });
  }
}
