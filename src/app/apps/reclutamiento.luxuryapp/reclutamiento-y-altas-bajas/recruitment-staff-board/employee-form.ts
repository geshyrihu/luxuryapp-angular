import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { LxMessage } from "@ui/adaptive/message/message";
import {
  LxSectionNav,
  type LxSectionNavItem,
} from "@ui/web/section-nav/section-nav";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ROUTES } from "src/app/routing/route-paths";
import { EmployeeBeneficiaryList } from "../../../recursos-humanos.luxuryapp/employee-beneficiary/employee-beneficiary-list";
import { EmployeeBankDataList } from "../../../recursos-humanos.luxuryapp/employee-bank-data/employee-bank-data-list";
import { EmployeeClinicalDataList } from "../../../recursos-humanos.luxuryapp/employee-clinical-data/employee-clinical-data-list";
import { EmployeeDocumentList } from "../../../recursos-humanos.luxuryapp/employee-document/employee-document-list";
import { EmployeeEmergencyContactList } from "../../../recursos-humanos.luxuryapp/employee-emergen-contact/employee-emergency-contact-list";
import { EmployeeUnifiedProfileForm } from "./employee-unified-profile-form";

@Component({
  selector: "app-employee-form",
  templateUrl: "./employee-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [
    `
      .employee-shell-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .employee-shell-header lx-section-nav {
        flex: 1 1 720px;
      }

    `,
  ],
  imports: [
    CommonModule,
    EmployeeBankDataList,
    EmployeeClinicalDataList,
    EmployeeEmergencyContactList,
    EmployeeBeneficiaryList,
    EmployeeUnifiedProfileForm,
    EmployeeDocumentList,
    LxMessage,
    LxSectionNav,
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
  activeSection: string = "profile";

  // ?? Items del mené
  menuItems: LxSectionNavItem[] = [];

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
      value: string;
    };

    const all: MenuDef[] = [
      {
        label: "Ficha de empleado",
        icon: "material-symbols-light:person",
        value: "profile",
      },
      {
        label: "Contactos",
        icon: "material-symbols-light:call",
        value: "contacts",
      },
      {
        label: "Datos bancarios",
        icon: "material-symbols-light:credit-card",
        value: "bank-data",
      },
      {
        label: "Beneficiarios",
        icon: "material-symbols-light:groups",
        value: "beneficiary",
      },
      {
        label: "Datos clínicos",
        icon: "material-symbols-light:favorite-outline",
        value: "clinical-data",
      },
      {
        label: "Documentación",
        icon: "material-symbols-light:folder-open",
        value: "documents",
      },
    ];

    this.menuItems = all;
  }

  changeSection(section: string) {
    this.activeSection = section;
  }
}

