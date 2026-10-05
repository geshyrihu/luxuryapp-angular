import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { PrestamoHerramientasControlDesktop } from "./desktop/prestamo-herramientas-control-desktop";
import { PrestamoHerramientasControlMobile } from "./mobile/prestamo-herramientas-control-mobile";
import { PrestamoHerramientaFormControl } from "./prestamo-herramienta-form-control";

@Component({
  selector: "app-prestamo-herramientas-control",
  templateUrl: "./prestamo-herramientas-control.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    PrestamoHerramientasControlDesktop,
    PrestamoHerramientasControlMobile,
  ],
})
export class PrestamoHerramientasControl {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;
  platformS = inject(PlatformService);

  // Pagination Setup
  rows = 30;
  totalRecords = 0;
  page: number = 1;
  searchTerm: string = "";
  sortField: string = "";
  sortOrder: number = 1;

  canManage = this.aspRoleS.anyOf([
    ApplicationRole.SuperUsuario,
    ApplicationRole.JefeMantenimiento,
    ApplicationRole.Almacenista,
  ]);
  rolAuthMobile = this.aspRoleS.anyOf([
    ApplicationRole.SuperUsuario,
    ApplicationRole.JefeMantenimiento,
  ]);

  dataSignal = signal<any>({
    items: [],
    totalRecords: 0,
  });

  globalFilterFields = computed(() => {
    const data = this.dataSignal().items;
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  loadDataLazy(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.rows = event.rows;
    this.sortField = event.sortField;
    this.sortOrder = event.sortOrder;
    this.onLoadData();
  }

  applyFilter() {
    this.page = 1;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.ToolLoans.listByCustomer(
      this.customerIdS.customerId(),
    );
    const httpParams = {
      page: this.page,
      recordsNumber: this.rows,
      filter: this.searchTerm,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };

    this.apiResponseS.onGetList(urlApi, httpParams).then((result: any) => {
      this.dataSignal.set(result);
      this.totalRecords = result.totalRecords;
      this.loading.set(false);
    });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.ToolLoans.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) => ({
            ...data,
            items: data.items.filter((item: any) => item.id !== id),
            totalRecords: data.totalRecords - 1,
          }));
          this.totalRecords--;
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PrestamoHerramientaFormControl,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
