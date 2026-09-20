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
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { addIcons } from "ionicons";
import {
  createOutline,
  imageOutline,
  locationOutline,
  trashOutline,
} from "ionicons/icons";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { CustomerLocationList } from "../customer-locations/customer-location-list";
import { CustomerAddress } from "./customer-address";
import { CustomerForm } from "./customer-form";
import { CustomerImages } from "./customer-images";
import { CustomerDto } from "./interfaces/customer.dto";
import { SelectItemDto } from "@core/interfaces/select-item.dto";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

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
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxAvatar,
    NgbTooltipModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonIconActiveDesactive,
    TableCaption,
    TableFooter,
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

  readonly tableRows: number = tableRows();
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

  onManageLocations(customerId: string, customerName?: string) {
    this.dialogHandlerS
      .openDialog(
        CustomerLocationList,
        { customerId },
        `Ubicaciones - ${customerName || customerId}`,
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

  /** Entidades federativas para mostrar en la tabla (espejo de MexicanStateEnum). */
  stateOptions = computed<SelectItemDto[]>(() => [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Ciudad de México",
    "Coahuila",
    "Colima",
    "Durango",
    "Estado de México",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
  ].map((label, index) => ({ value: index, label })));

  /** Obtiene el label del estado para un valor numérico. */
  getStateLabel(stateValue: number): string {
    const found = this.stateOptions().find((opt) => opt.value === stateValue);
    return found?.label ?? "Desconocido";
  }
}

