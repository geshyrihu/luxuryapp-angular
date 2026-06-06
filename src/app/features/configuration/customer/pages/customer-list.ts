import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { IonAvatar } from "@ionic/angular/standalone";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { addIcons } from "ionicons";
import {
  createOutline,
  imageOutline,
  locationOutline,
  trashOutline,
} from "ionicons/icons";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
  IonButtonActiveDesactive,
  IonButtonItem,
} from "src/app/core/components/buttons/mobile";
import { CustomBtnActiveDesactive } from "src/app/core/components/buttons/web/custom-button-active-desactive";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CustomerAddress } from "../customer-address/pages/customer-address";
import { ICustomerDTO } from "../models/customer.dto";
import { CustomerForm } from "./customer-form";
import { CustomerImages } from "./customer-images";
@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.html",
  imports: [
    TableModule,
    AvatarModule,
    NgbTooltipModule,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    CustomBtnActiveDesactive,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,

    IonAvatar,
    IonButtonActiveDesactive,

    IonButtonItem,
  ],
})
export class CustomerList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);

  // Declaración e inicialización de variables con Signals
  dataSignal = signal<ICustomerDTO[]>([]);
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
      .onGetList<ICustomerDTO[]>(Endpoints.Customers.getAll(this.state))
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
