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
import { globalFilterFields } from "@core/helpers/table-options";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { EmployeeProviderForm } from "@shared/integration/supplier";
import { EmployeeInternalService } from "../../../employees/employee-internal.service";
import { CardEmployee } from "./card-employee";
import { EmployeeListDesktop } from "./desktop/employee-list-desktop";
import { IEmployee } from "./interfaces/employee.interface";
import { EmployeeListMobile } from "./mobile/employee-list-mobile";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EmployeeListDesktop, EmployeeListMobile],
})
export class EmployeeList {
  authS = inject(AuthService);
  employeeS = inject(EmployeeInternalService);
  aspRoleS = inject(AspRoleService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  rutaActiva = inject(ActivatedRoute);
  router = inject(Router);
  platformS = inject(PlatformService);
  public AspRole = ApplicationRole;
  activo = signal<boolean>(true);

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
        this.dialogHandlerS.sizeXl,
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
      this.dialogHandlerS.sizeXl,
    );
  }

  onShowEditEmpleado(employeeId: any, applicationUserId: string) {
    const urlApi = `directory/empleado/${employeeId}/${applicationUserId}`;
    this.router.navigateByUrl(urlApi);
  }
}
