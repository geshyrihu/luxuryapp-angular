import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { addIcons } from "ionicons";
import {
  createOutline,
  imageOutline,
  locationOutline,
  trashOutline,
} from "ionicons/icons";
import { CustomerLocationList } from "../customer-locations/customer-location-list";
import { CustomerAddress } from "./customer-address";
import { CustomerForm } from "./customer-form";
import { CustomerImages } from "./customer-images";
import { CustomerListDesktop } from "./desktop/customer-list-desktop";
import { CustomerDto } from "./interfaces/customer.dto";
import { CustomerListMobile } from "./mobile/customer-list-mobile";

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomerListDesktop, CustomerListMobile],
})
export class CustomerList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  // Declaración e inicialización de variables con Signals
  dataSignal = signal<CustomerDto[]>([]);
  loading = signal(true);

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

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este cliente?",
    );
    if (!confirmed) return;
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
      .openDialog(CustomerForm, data, data.title, this.dialogHandlerS.sizeXl)
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
  stateOptions = computed<SelectItemDto[]>(() =>
    [
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
    ].map((label, index) => ({ value: index, label })),
  );

  /** Obtiene el label del estado para un valor numérico. */
  getStateLabel(stateValue: number): string {
    const found = this.stateOptions().find((opt) => opt.value === stateValue);
    return found?.label ?? "Desconocido";
  }
}
