import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { EndpointsAdmin } from "src/app/core/constants/endpoints/admin.endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { DialogSize } from "../../../../core/enums/dialog-size.enum";
import { CustomerLocationForm } from "./customer-location-form";
import {
  CustomerLocationType,
  CustomerLocationTypeLabels,
} from "./interfaces/customer-location-type.enum";
import { CustomerLocationDto } from "./interfaces/customer-location.dto";

@Component({
  selector: "app-customer-location-list",
  templateUrl: "./customer-location-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    TableModule,
    NgbTooltipModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileListItem,
  ],
})
export class CustomerLocationList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  dataSignal = signal<CustomerLocationDto[]>([]);
  loading = signal(true);

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  scrollHeight = this.tableScrollHeightS.scrollHeight;

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
        DialogSize.md,
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
        DialogSize.md,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
