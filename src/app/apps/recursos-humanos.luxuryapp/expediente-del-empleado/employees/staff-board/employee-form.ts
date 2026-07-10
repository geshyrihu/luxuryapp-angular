import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxPanelMenu } from "@ui/adaptive/panel-menu/panel-menu";
import { MenuItem } from "primeng/api";
import { UpdatePasswordAccount } from "src/app/apps/admin.luxuryapp/application-user/update-password-account";
import { UpdateRole } from "src/app/apps/admin.luxuryapp/application-user/update-role";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";
import { EmployeeReclutamiento } from "../../../../../features/recruitment/reclutamiento-y-altas-bajas/pages/employee-reclutamiento";
import { IncidentList } from "../../recursos-humanos/incidencias-sanciones/incident/pages/incident-list";
import { EmployeeBankDataList } from "../employee-bank-data/pages/employee-bank-data-list";
import { EmployeeClinicalDataList } from "../employee-clinical-data/pages/employee-clinical-data-list";
import { EmployeeEmergencyContactList } from "../employee-emergency-contact/pages/employee-emergency-contact-list";
import { EmployeeAddressForm } from "../employee-internal/pages/employee-address-form";
import { EmployeeAvatarForm } from "../employee-internal/pages/employee-avatar-form";
import { EmployeeLaboralDataForm } from "../employee-internal/pages/employee-laboral-data-form";
import { EmployeePersonalDataForm } from "../employee-internal/pages/employee-personal-data-form";
import { EmployeePrincipalDataForm } from "../employee-internal/pages/employee-principal-data-form";
@Component({
  selector: "app-employee-form",
  templateUrl: "./employee-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    EmployeeAddressForm,
    EmployeeAvatarForm,
    EmployeeBankDataList,
    EmployeeClinicalDataList,
    EmployeeEmergencyContactList,
    EmployeeLaboralDataForm,
    EmployeePersonalDataForm,
    EmployeePrincipalDataForm,
    EmployeeReclutamiento,
    IncidentList,
    LxMessage,
    LxPanelMenu,
    UpdatePasswordAccount,
    UpdateRole,
  ],
})
export class EmployeeForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  applicationUserId: string = "";
  employeeId: string = "";
  nameEmployee = signal("");
  tienePermiso: boolean = true;

  // ?? Sección activa
  activeSection: string = "principal";

  // ?? Items del mení
  menuItems: MenuItem[] = [];

  paramsSignal = toSignal(this.route.paramMap);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params) {
        const empId = params.get("employeeId");
        const appUserId = params.get("applicationUserId");

        if (empId) this.employeeId = empId;
        if (appUserId) this.applicationUserId = appUserId;

        if (!this.applicationUserId) {
          this.router.navigate(ROUTES.DIRECTORIO.PERSONAL_INTERNO);
          return;
        }

        this.apiResponseS
          .onGetItem(`application-users/CardUser/${appUserId}`)
          .then((result: any) => {
            this.nameEmployee.set(`${result.fullName} `);
          });
        // Inicializar mení despuós de tener los datos
        this.initializeMenu();
      }
    });
  }

  ngOnInit() {
    // Logic moved to effect
  }

  initializeMenu() {
    type MenuDef = {
      label: string;
      icon: string;
      section: string;
      roles?: EApplicationRole[];
    };

    const all: MenuDef[] = [
      // Sin restricción de rol é visible para cualquier usuario autorizado
      {
        label: "Datos principales",
        icon: "mdi:account",
        section: "principal",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },
      {
        label: "Foto de perfil",
        icon: "mdi:image",
        section: "avatar",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },
      {
        label: "Datos personales",
        icon: "mdi:card-account-details",
        section: "personal",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },
      {
        label: "Dirección",
        icon: "mdi:map-marker",
        section: "address",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },
      {
        label: "Contactos",
        icon: "mdi:phone",
        section: "contacts",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },
      {
        label: "Datos bancarios y beneficiario",
        icon: "mdi:credit-card",
        section: "bank-data",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },
      {
        label: "Datos clinicos",
        icon: "mdi:heart-outline",
        section: "clinical-data",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },

      // Solo gestión interna RR.HH.
      {
        label: "Datos laborales",
        icon: "mdi:briefcase",
        section: "laboral",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },

      // Solo quienes gestionan reclutamiento
      {
        label: "Reclutamiento",
        icon: "mdi:format-list-bulleted",
        section: "recruitment",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.RecursosHumanos,
          EApplicationRole.Reclutamiento,
        ],
      },

      // Solo quienes pueden ver / registrar incidencias
      {
        label: "Incidencias Administrativas",
        icon: "mdi:alert",
        section: "incidents",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },

      // Solo acceso túcnico / sistemas
      {
        label: "Usuario app",
        icon: "mdi:key",
        section: "user",
        roles: [
          EApplicationRole.SuperUsuario,
          EApplicationRole.Administrador,
          EApplicationRole.Asistente,
          EApplicationRole.RecursosHumanos,
        ],
      },
    ];

    this.menuItems = all
      .filter((item) => !item.roles || this.aspRoleS.hasAny(item.roles))
      .map((item) => ({
        label: item.label,
        icon: item.icon,
        command: () => this.changeSection(item.section),
      }));
  }

  changeSection(section: string) {
    this.activeSection = section;
  }

  onValidarAdminAsis() {
    this.apiResponseS
      .onGetItem(`Employees/validaradminasis/${this.authS.applicationUserId}`)
      .then((result: any) => {
        this.tienePermiso = result;
      });
  }
}
