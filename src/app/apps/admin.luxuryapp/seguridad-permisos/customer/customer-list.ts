import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { addIcons } from "ionicons";
import {
  createOutline,
  imageOutline,
  locationOutline,
  trashOutline,
} from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CustomerForm } from "./customer-form";
import { CustomerImages } from "./customer-images";
import { CustomerDto } from "./interfaces/customer.dto";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { CustomerAddress } from "./customer-address";

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileListItem,
    WebButtonIconItem,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    LxAvatar,
    NgbTooltipModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonIconActiveDesactive,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    AppIcon,
    DataViewMobile,
  ],
})
export class CustomerList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);

  // Declaración e inicialización de variables con Signals
  dataSignal = signal<CustomerDto[]>([]);
  loading = signal(true);

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  // Usar el servicio global para scrollHeight
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  // Computed para globalFilterFields
  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ref: DynamicDialogRef;
  title = "Activos";
  state = true;
  mostrar = true;

  constructor() {
    addIcons({ createOutline, imageOutline, locationOutline, trashOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<CustomerDto[]>(Endpoints.Customers.getAll(this.state))
      .then((result) => {
        if (result) {
          this.dataSignal.set(result);
        }
      });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.Customers.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(CustomerForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onUpdateImages(customerId: string) {
    this.dialogHandlerS
      .openDialog(
        CustomerImages,
        { customerId },
        "Actualizar Imagenes",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onUpdateAddress(customerId: string) {
    this.dialogHandlerS
      .openDialog(
        CustomerAddress,
        { customerId },
        "Actualizar Direccion",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onSortChange(valor: any) {
    this.state = valor;
    this.state === true ? (this.title = "Activos") : (this.title = "Inactivos");
    this.onLoadData();
  }
}
