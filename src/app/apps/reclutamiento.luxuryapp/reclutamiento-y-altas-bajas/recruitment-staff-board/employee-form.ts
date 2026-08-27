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
import { MenuItem } from "@ui/web/primeng-api/primeng-api";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ROUTES } from "src/app/routing/route-paths";
import { EmployeeBankDataList } from "../../../recursos-humanos.luxuryapp/employee-bank-data/employee-bank-data-list";
import { EmployeeClinicalDataList } from "../../../recursos-humanos.luxuryapp/employee-clinical-data/employee-clinical-data-list";
import { EmployeeDocumentList } from "../../../recursos-humanos.luxuryapp/employee-document/employee-document-list";
import { EmployeeEmergencyContactList } from "../../../recursos-humanos.luxuryapp/employee-emergen-contact/employee-emergency-contact-list";
import { EmployeeAddressForm } from "../../../recursos-humanos.luxuryapp/employee/employee-address-form";
import { EmployeeAvatarForm } from "../../../recursos-humanos.luxuryapp/employee/employee-avatar-form";
import { EmployeeLaboralDataForm } from "../../../recursos-humanos.luxuryapp/employee/employee-laboral-data-form";
import { EmployeePersonalDataForm } from "../../../recursos-humanos.luxuryapp/employee/employee-personal-data-form";
import { EmployeePrincipalDataForm } from "../../../recursos-humanos.luxuryapp/employee/employee-principal-data-form";
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
    EmployeeDocumentList,
    LxMessage,
    LxPanelMenu,
  ],
})
export class EmployeeForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  applicationUserId: string = "";
  employeeId: string = "";
  nameEmployee = signal("");

  // ?? Sección activa
  activeSection: string = "principal";

  // ?? Items del mené
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
          .onGetItem(Endpoints.EmployeeInternal.cardUser(appUserId))
          .then((result: any) => {
            this.nameEmployee.set(`${result.fullName} `);
          });
        // Inicializar mené despuós de tener los datos
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
    };

    const all: MenuDef[] = [
      {
        label: "Datos principales",
        icon: "material-symbols-light:person",
        section: "principal",
      },
      {
        label: "Foto de perfil",
        icon: "material-symbols-light:photo",
        section: "avatar",
      },
      {
        label: "Datos personales",
        icon: "material-symbols-light:badge",
        section: "personal",
      },
      {
        label: "Dirección",
        icon: "material-symbols-light:location-on",
        section: "address",
      },
      {
        label: "Contactos",
        icon: "material-symbols-light:call",
        section: "contacts",
      },
      {
        label: "Datos bancarios y beneficiario",
        icon: "material-symbols-light:credit-card",
        section: "bank-data",
      },
      {
        label: "Datos clinicos",
        icon: "material-symbols-light:favorite-outline",
        section: "clinical-data",
      },
      {
        label: "Datos laborales",
        icon: "material-symbols-light:work",
        section: "laboral",
      },
      {
        label: "Documentación",
        icon: "material-symbols-light:folder-open",
        section: "documents",
      },
    ];

    this.menuItems = all.map((item) => ({
      label: item.label,
      icon: item.icon,
      command: () => this.changeSection(item.section),
    }));
  }

  changeSection(section: string) {
    this.activeSection = section;
  }
}
