import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { storefrontOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { RatingModule } from "primeng/rating";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IBusquedaProveedor } from "src/app/core/interfaces/busqueda-proveedor.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CalificacionProveedor } from "src/app/features/purchasing/providers/provider-qualification/calificacion-proveedor";
import { ProveedorForm } from "./proveedor-form";
import { TarjetaProveedor } from "./provider-card";
import { ProviderUse } from "./provider-use";
@Component({
  selector: "app-provider-list",
  templateUrl: "./provider-list.html",
  imports: [
    EmptyState,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    CustomSearchInput,
    RatingModule,
    TooltipModule,
    TagModule,
    CustomButton,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
  ],
})
export class ListProvider implements OnInit {
  roles = EApplicationRole;
  // Servicios inyectados
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  // Datos de la tabla
  dataSignal = signal<IBusquedaProveedor[]>([]);
  totalRecords: number = 0; // Total de registros para paginador
  AspRole = EApplicationRole;
  // ConfiguraciÃ³n de paginaciÃ³n y filtro
  rows: number = 30; // Registros por pÃ³gina
  first: number = 0; // Ã³ndice del primer registro
  page: number = 1; // PÃ³gina actual
  searchTerm: string = ""; // Filtro global

  // Opciones de paginaciÃ³n y filtro global para PrimeNG
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  mobileGlobalFilterFields = ["mobileSearchBlob"];
  mobileData = computed(() =>
    this.dataSignal().map((item) => ({
      ...item,
      mobileSearchBlob: this.buildMobileSearchBlob(item),
    })),
  );
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  loading = signal(true);

  // Propiedades que antes estaban en el caption y ahora necesita este componente
  title: string = "Directorio de Proveedores"; // O el TÃ­tulo que prefieras
  label: string = "Agregar";
  rolAuth: boolean = false; // La inicializaremos en ngOnInit

  // Referencia para diÃ¡logos
  ref: DynamicDialogRef;

  // Opciones de filtro para tipo de servicio y nivel de acceso
  serviceTypes = [
    { label: "Todos", value: null },
    { label: "Servicio Fijo", value: "ServicioFijo" },
    { label: "Servicios Variables", value: "ServiciosVariables" },
    { label: "Devoluciones", value: "Devoluciones" },
  ];
  nivelAccesos = [
    { label: "PÃ³blico", value: 0 },
    { label: "Privado", value: 1 },
  ];
  selectedServiceTypeControl = new FormControl<string | null>(null);
  // selectedNivelAcceso: number = 0;

  // InicializaciÃ³n del componente
  ngOnInit(): void {
    this.onLoadData();
    // Inicializamos la variable para el botÃ³n de agregar
    this.rolAuth = this.aspRoleS.hasAny([
      EApplicationRole.Asistente,
      EApplicationRole.JefeMantenimiento,
      EApplicationRole.Administrador,
      EApplicationRole.SuperUsuario,
      EApplicationRole.Legal,
    ]);
  }

  // ValidaciÃ³n de roles para mostrar/ocultar acciones
  validateRole(value: EApplicationRole[]): boolean {
    return this.aspRoleS.hasAny(value);
  }

  // Este mÃ³todo se llama cada vez que el usuario escribe en el buscador
  applyGlobalFilter(filterValue: string) {
    this.searchTerm = filterValue; // Actualizamos el tÃ©rmino de bÃ³squeda
    this.first = 0; // Reiniciamos la paginaciÃ³n a la primera pÃ³gina
    this.page = 1;
    this.onLoadData(this.page, this.rows, this.searchTerm);
  }
  constructor() {
    addIcons({ storefrontOutline });
    effect(() => {
      this.onLoadData();
    });
  }

  // Carga de datos con paginaciÃ³n y filtros
  onLoadData(
    page: number = 1,
    pageSize: number = this.rows,
    filter: string = this.searchTerm,
  ) {
    const urlApi = `providers/list`;
    const httpParams: any = {
      customerId: this.customerIdS.customerId(), // Obtenemos el ID del servicio
      page,
      recordsNumber: pageSize,
      filter,
    };
    // Solo agrega los filtros si tienen valor (evita enviar null)
    if (this.selectedServiceTypeControl.value)
      httpParams.tipoServicio = this.selectedServiceTypeControl.value;
    // if (this.selectedNivelAcceso)
    //   httpParams.nivelAcceso = this.selectedNivelAcceso;

    return this.apiResponseS
      .onGetList(urlApi, httpParams)
      .then((result: any) => {
        // Manejo seguro de la respuesta para evitar errores si el backend responde con error
        this.dataSignal.set(result?.items ?? []);
        this.totalRecords = result?.totalRecords ?? 0;
      });
  }

  // Evento de paginaciÃ³n de PrimeNG
  loadDataLazy(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.onLoadData(this.page, this.rows, this.searchTerm);
  }

  // Aplica filtro global y reinicia la paginaciÃ³n
  applyFilter() {
    this.first = 0;
    this.page = 1;
    this.onLoadData(this.page, this.rows, this.searchTerm);
  }

  // Aplica filtros de tipo de servicio y nivel de acceso
  onFilterChange() {
    this.first = 0;
    this.page = 1;
    this.onLoadData(this.page, this.rows, this.searchTerm);
  }

  // Elimina un proveedor
  onDelete(id: any) {
    return this.apiResponseS
      .onDelete(Endpoints.Providers.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.providerId !== id),
          );
      });
  }

  // Autoriza un proveedor
  onAutorizarProvider(providerId: any) {
    const urlApi = `providers/Autorizar/${providerId}`;
    this.apiResponseS.onGetList(urlApi).then(() => {
      this.onLoadData();
    });
  }

  // Muestra la tarjeta del proveedor
  showModalCardProveedor(data: any) {
    this.dialogHandlerS.openDialog(
      TarjetaProveedor,
      data,
      data.title,
      this.dialogHandlerS.sizeLg,
    );
  }

  // Muestra coincidencias de uso del proveedor
  onConicidencias(data: any) {
    this.dialogHandlerS.openDialog(
      ProviderUse,
      data,
      data.title,
      this.dialogHandlerS.sizeLg,
    );
  }

  // Abre modal para agregar o editar proveedor
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(ProveedorForm, data, data.title, this.dialogHandlerS.sizeFull)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  // Modal para calificar proveedor,
  showModalCalificarProveedor(data: any) {
    this.dialogHandlerS
      .openDialog(
        CalificacionProveedor,
        {
          providerId: data.providerId,
        },
        "Calificar a " + data.nameProvider,
        this.dialogHandlerS.sizeSm,
      )
      .then((result: boolean) => {
        if (result) this.applyFilter();
      });
  }
  calificacionPromedio(data: any, valor: string): number {
    let suma: number = 0;
    data.forEach((element) => {
      suma += element[valor];
    });
    const restult = suma / data.length;

    return restult;
  }
  // Cambia el estado (activo/inactivo) del proveedor
  onActivateProvider(data: any) {
    this.apiResponseS
      .onPut(`Providers/change-state/${data.providerId}/${data.state}`, null)
      .then(() => {
        this.onLoadData();
      });
  }

  private buildMobileSearchBlob(item: IBusquedaProveedor): string {
    const tokens = new Set<string>();

    const pushToken = (value: unknown): void => {
      if (value == null) return;

      const normalized = String(value).trim().toLowerCase();
      if (normalized) {
        tokens.add(normalized);
      }
    };

    const pushBooleanAliases = (key: string, value: boolean): void => {
      pushToken(key);
      pushToken(value ? "si" : "no");

      if (key === "activo") {
        pushToken(value ? "activo" : "inactivo");
      }
      if (key === "autorizado") {
        pushToken(value ? "autorizado" : "desautorizado");
      }
      if (key === "sales" && value) {
        pushToken("ventas");
      }
      if (key === "repair" && value) {
        pushToken("reparacion");
        pushToken("reparaciÃ³n");
      }
    };

    const collectValues = (value: unknown, key = ""): void => {
      if (value == null) return;

      if (typeof value === "string" || typeof value === "number") {
        pushToken(key);
        pushToken(value);
        return;
      }

      if (typeof value === "boolean") {
        pushBooleanAliases(key, value);
        return;
      }

      if (Array.isArray(value)) {
        pushToken(key);
        value.forEach((entry) => collectValues(entry, key));
        return;
      }

      if (typeof value === "object") {
        pushToken(key);
        Object.entries(value as object).forEach(([childKey, childValue]) => {
          pushToken(childKey);
          collectValues(childValue, childKey);
        });
      }
    };

    Object.entries(item).forEach(([key, value]) => collectValues(value, key));

    const categorias = Array.isArray(item.categorias) ? item.categorias : [];
    categorias.forEach((categoria) => {
      pushToken("categoria");
      pushToken("categorias");
      pushToken(categoria.nombreCategoria);
    });

    return Array.from(tokens).join(" ");
  }
}
