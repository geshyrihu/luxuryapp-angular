import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { EndpointsAdmin } from "@core/constants/endpoints/admin.endpoints";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { CustomerLocationForm } from "./customer-location-form";
import { CustomerLocationListDesktop } from "./desktop/customer-location-list-desktop";
import {
  CustomerLocationType,
  CustomerLocationTypeLabels,
} from "./interfaces/customer-location-type.enum";
import { CustomerLocationDto } from "./interfaces/customer-location.dto";
import { CustomerLocationListMobile } from "./mobile/customer-location-list-mobile";

@Component({
  selector: "app-customer-location-list",
  templateUrl: "./customer-location-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomerLocationListDesktop, CustomerLocationListMobile],
})
export class CustomerLocationList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  dataSignal = signal<CustomerLocationDto[]>([]);
  loading = signal(true);

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  readonly globalFilterFields = signal<string[]>([
    "name",
    "locationType",
    "phoneOne",
    "contactName",
  ]);

  customerId: string = "";
  customerName: string = "";

  ngOnInit(): void {
    this.customerId = this.config.data?.customerId;
    this.customerName = this.config.data?.customerName ?? "";
    this.onLoadData();
  }

  onLoadData() {
    if (!this.customerId) return;

    this.loading.set(true);
    this.apiResponseS
      .onGetList<CustomerLocationDto[]>(
        EndpointsAdmin.CustomerLocations.listByCustomer(this.customerId),
      )
      .then((result) => {
        if (result) {
          this.dataSignal.set(result);
        }
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  getLocationTypeLabel(type: string): string {
    return CustomerLocationTypeLabels[type as CustomerLocationType] || type;
  }

  onEdit(item: CustomerLocationDto) {
    this.dialogHandlerS
      .openDialog(
        CustomerLocationForm,
        { customerId: this.customerId, id: item.id },
        "Editar Ubicación",
        this.dialogHandlerS.sizeMd,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(EndpointsAdmin.CustomerLocations.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onNew() {
    this.dialogHandlerS
      .openDialog(
        CustomerLocationForm,
        { customerId: this.customerId },
        "Nueva Ubicación",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
