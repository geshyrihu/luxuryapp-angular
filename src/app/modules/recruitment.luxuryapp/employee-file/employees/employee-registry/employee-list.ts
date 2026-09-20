import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { Department } from "@core/enums/department.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { EmployeeProviderForm } from "@shared/integration/supplier";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import { EmployeeInternalService } from "../../../employees/employee-internal.service";
import { CardEmployee } from "./card-employee";
import { IEmployee } from "./interfaces/employee.interface";

import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxTag,
    LxAvatar,
    AppIcon,
    MobileListItem,
    WebButtonIconActiveDesactive,
    WebButtonIconItem,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelItem,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,

    TableCaption,
    TableFooter,
    DataViewMobile,
  ],
})
export class EmployeeList {
  authS = inject(AuthService);
  // apiResponseS = inject(ApiResponseService); // Removed
  employeeS = inject(EmployeeInternalService); // Added
  aspRoleS = inject(AspRoleService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  rutaActiva = inject(ActivatedRoute);
  router = inject(Router);
  public AspRole = ApplicationRole;
  activo = signal<boolean>(true);

  readonly departamentLabels: Record<number, string> = {
    [Department.Administracion]: "Administración",
    [Department.Legal]: "Legal",
    [Department.Contabilidad]: "Contabilidad",
    [Department.Mantenimiento]: "Mantenimiento",
    [Department.Limpieza]: "Limpieza",
    [Department.Operaciones]: "Operaciones",
    [Department.Jardineria]: "Jardinería",
    [Department.Sistemas]: "Sistemas",
    [Department.Seguridad]: "Seguridad",
    [Department.Constructora]: "Constructora",
    [Department.Supervision]: "Supervisión",
    [Department.Direcciones]: "Dirección",
    [Department.RecursosHumanos]: "Recursos Humanos",
    [Department.Reclutamiento]: "Reclutamiento",
    [Department.Recepcion]: "Recepción",
    [Department.Mensajeria]: "Mensajería",
    [Department.Ludoteca]: "Ludoteca",
    [Department.NA]: "Sin Departamento",
  };

  getDepartamentLabel(value: number | null | undefined): string {
    if (value === null || value === undefined) return "Sin Departamento";
    return this.departamentLabels[value] ?? "Sin Departamento";
  }
  dataSignal = signal<IEmployee[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  getAllEmployeeActive: any = [];
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onSelectActive(active: boolean): any {
    this.activo.set(active);
    this.onLoadData();
  }

  onLoadData() {
    this.employeeS
      .getList(this.customerIdS.customerId(), this.activo())
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onValidateShowTIcket(applicationRoleId: any): boolean {
    let permission = true;
    if (applicationRoleId == 5) {
      permission = this.aspRoleS.hasAny([
        ApplicationRole.JefeMantenimiento,
        ApplicationRole.SuperUsuario,
        ApplicationRole.Reclutamiento,
      ]);
    }
    if (applicationRoleId == 6) {
      permission = this.aspRoleS.hasAny([
        ApplicationRole.JefeMantenimiento,
        ApplicationRole.SuperUsuario,
        ApplicationRole.Reclutamiento,
        ApplicationRole.Administrador,
      ]);
    }
    return permission;
  }
  showModalAddEmployee() {
    this.dialogHandlerS
      .openDialog(
        EmployeeProviderForm,
        { typePerson: 0 },
        "Registrar Empleado.",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployee,
      { applicationUserId },
      "Colaborador",
      this.dialogHandlerS.sizeLg,
    );
  }

  onShowEditEmpleado(employeeId: any, applicationUserId: string) {
    const urlApi = `directory/empleado/${employeeId}/${applicationUserId}`;
    this.router.navigateByUrl(urlApi);
  }
}
