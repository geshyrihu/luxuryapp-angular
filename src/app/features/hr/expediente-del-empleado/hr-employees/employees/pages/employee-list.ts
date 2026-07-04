import { Component, computed, effect, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { IonAvatar } from "@ionic/angular/standalone";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelItem } from "@ui/buttons/web-label";
import { WebButtonLabelActiveDesactive } from "@ui/buttons/web-label/button-active-desactive";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { EDepartament } from "src/app/core/enums/EDepartament";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EmployeeProviderForm } from "../../../../../purchasing/providers/provider/pages/employee-provider-form";
import { EmployeeInternalService } from "../../employee-internal/services/employee-internal.service";
import { IEmployee } from "../models/employee.interface";
import { CardEmployee } from "./card-employee";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";

import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.html",
  imports: [
    WebButtonIconActiveDesactive,
    WebButtonIconItem,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonLabelActiveDesactive,
    WebButtonLabelItem,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    AvatarModule,
    IonAvatar,
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
  public AspRole = EApplicationRole;
  activo = signal<boolean>(true);

  readonly departamentLabels: Record<number, string> = {
    [EDepartament.Administracion]: "Administración",
    [EDepartament.Legal]: "Legal",
    [EDepartament.Contabilidad]: "Contabilidad",
    [EDepartament.Mantenimiento]: "Mantenimiento",
    [EDepartament.Limpieza]: "Limpieza",
    [EDepartament.Operaciones]: "Operaciones",
    [EDepartament.Jardineria]: "Jardinería",
    [EDepartament.Sistemas]: "Sistemas",
    [EDepartament.Seguridad]: "Seguridad",
    [EDepartament.Constructora]: "Constructora",
    [EDepartament.Supervision]: "Supervisión",
    [EDepartament.Direcciones]: "Dirección",
    [EDepartament.RecusrosHumanos]: "Recursos Humanos",
    [EDepartament.Reclutamiento]: "Reclutamiento",
    [EDepartament.Recepcion]: "Recepción",
    [EDepartament.Mensajeria]: "Mensajería",
    [EDepartament.Ludoteca]: "Ludoteca",
    [EDepartament.NA]: "Sin Departamento",
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
        EApplicationRole.JefeMantenimiento,
        EApplicationRole.SuperUsuario,
        EApplicationRole.Reclutamiento,
      ]);
    }
    if (applicationRoleId == 6) {
      permission = this.aspRoleS.hasAny([
        EApplicationRole.JefeMantenimiento,
        EApplicationRole.SuperUsuario,
        EApplicationRole.Reclutamiento,
        EApplicationRole.Administrador,
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
      this.dialogHandlerS.sizeSm,
    );
  }

  onShowEditEmpleado(employeeId: any, applicationUserId: string) {
    this.router.navigate(ROUTES.DIRECTORIO.EMPLEADO(employeeId, applicationUserId));
  }
}
