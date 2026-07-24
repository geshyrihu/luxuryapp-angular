import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { TabItem } from "@ui/base/tabs.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";
import {
  EmployeeFileBankDataDTO,
  EmployeeFileClinicalDataDTO,
  EmployeeFileContractDTO,
  EmployeeFileEmergencyContactDTO,
  EmployeeFileEvaluationDTO,
  EmployeeFileHeaderDTO,
  EmployeeFileIncidentDTO,
  EmployeeFilePersonalDataDTO,
  EmployeeFileRequestsDTO,
  EmployeeFileVacationsLeavesDTO,
  EmployeeFileWorkPositionDTO,
} from "./interfaces/employee-file.interfaces";

import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

@Component({
  selector: "app-employee-file-detail",
  templateUrl: "./employee-file-detail.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxCard,
    LxTag,
    LxTabs,
    WebButtonIconItem,
    LxTooltipDirective,
    DatePipe,
    CurrencyPipe,
    TableModule,
    AppIcon,
  ],
})
export class EmployeeFileDetail implements OnInit {
  apiResponseS = inject(ApiResponseService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  employeeId = signal<string>("");

  tabs: TabItem[] = [
    { id: "0", label: "Personales", icon: "mdi:account" },
    { id: "1", label: "Emergencia", icon: "mdi:phone" },
    { id: "2", label: "Clínicos", icon: "mdi:heart-outline" },
    { id: "3", label: "Bancarios", icon: "mdi:wallet" },
    { id: "4", label: "Contratos", icon: "mdi:file-document-outline" },
    { id: "5", label: "Puesto", icon: "mdi:briefcase" },
    { id: "6", label: "Vacaciones", icon: "mdi:calendar-plus" },
    { id: "7", label: "Incidencias", icon: "mdi:alert" },
    { id: "8", label: "Evaluaciones", icon: "mdi:chart-line" },
    { id: "9", label: "Solicitudes", icon: "mdi:send" },
  ];
  activeTab = model<string>("0");

  // Cabecera
  header = signal<EmployeeFileHeaderDTO | null>(null);

  // Tabs é carga lazy por demanda
  personalData = signal<EmployeeFilePersonalDataDTO | null>(null);
  emergencyContacts = signal<EmployeeFileEmergencyContactDTO[]>([]);
  clinicalData = signal<EmployeeFileClinicalDataDTO[]>([]);
  bankData = signal<EmployeeFileBankDataDTO[]>([]);
  contracts = signal<EmployeeFileContractDTO[]>([]);
  workPosition = signal<EmployeeFileWorkPositionDTO | null>(null);
  vacationsLeaves = signal<EmployeeFileVacationsLeavesDTO | null>(null);
  incidents = signal<EmployeeFileIncidentDTO[]>([]);
  evaluations = signal<EmployeeFileEvaluationDTO[]>([]);
  requests = signal<EmployeeFileRequestsDTO | null>(null);

  // Control de tabs cargadas
  private loadedTabs = new Set<number>();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("employeeId") ?? "";
    this.employeeId.set(id);
    this.loadHeader();
    this.onTabChange("0"); // Carga Tab 1 al iniciar
  }

  private loadHeader(): void {
    this.apiResponseS
      .onGetItem<EmployeeFileHeaderDTO>(
        Endpoints.HR.EmployeeFile.summary(this.employeeId()),
      )
      .then((result) => {
        if (result) this.header.set(result);
      });
  }

  onTabChange(tabId: string): void {
    const index = parseInt(tabId, 10);
    if (this.loadedTabs.has(index)) return;
    this.loadedTabs.add(index);
    const id = this.employeeId();

    switch (index) {
      case 0:
        this.apiResponseS
          .onGetItem<EmployeeFilePersonalDataDTO>(
            Endpoints.HR.EmployeeFile.personalData(id),
          )
          .then((r) => {
            if (r) this.personalData.set(r);
          });
        break;
      case 1:
        this.apiResponseS
          .onGetList<EmployeeFileEmergencyContactDTO[]>(
            Endpoints.HR.EmployeeFile.emergencyContacts(id),
          )
          .then((r) => {
            if (r) this.emergencyContacts.set(r);
          });
        break;
      case 2:
        this.apiResponseS
          .onGetList<EmployeeFileClinicalDataDTO[]>(
            Endpoints.HR.EmployeeFile.clinicalData(id),
          )
          .then((r) => {
            if (r) this.clinicalData.set(r);
          });
        break;
      case 3:
        this.apiResponseS
          .onGetList<EmployeeFileBankDataDTO[]>(
            Endpoints.HR.EmployeeFile.bankData(id),
          )
          .then((r) => {
            if (r) this.bankData.set(r);
          });
        break;
      case 4:
        this.apiResponseS
          .onGetList<EmployeeFileContractDTO[]>(
            Endpoints.HR.EmployeeFile.contracts(id),
          )
          .then((r) => {
            if (r) this.contracts.set(r);
          });
        break;
      case 5:
        this.apiResponseS
          .onGetItem<EmployeeFileWorkPositionDTO>(
            Endpoints.HR.EmployeeFile.workPosition(id),
          )
          .then((r) => {
            if (r) this.workPosition.set(r);
          });
        break;
      case 6:
        this.apiResponseS
          .onGetItem<EmployeeFileVacationsLeavesDTO>(
            Endpoints.HR.EmployeeFile.vacationsLeaves(id),
          )
          .then((r) => {
            if (r) this.vacationsLeaves.set(r);
          });
        break;
      case 7:
        this.apiResponseS
          .onGetList<EmployeeFileIncidentDTO[]>(
            Endpoints.HR.EmployeeFile.incidents(id),
          )
          .then((r) => {
            if (r) this.incidents.set(r);
          });
        break;
      case 8:
        this.apiResponseS
          .onGetList<EmployeeFileEvaluationDTO[]>(
            Endpoints.HR.EmployeeFile.evaluations(id),
          )
          .then((r) => {
            if (r) this.evaluations.set(r);
          });
        break;
      case 9:
        this.apiResponseS
          .onGetItem<EmployeeFileRequestsDTO>(
            Endpoints.HR.EmployeeFile.requests(id),
          )
          .then((r) => {
            if (r) this.requests.set(r);
          });
        break;
    }
  }

  onDownloadAct(url: string | undefined): void {
    if (url) window.open(url, "_blank");
  }

  goBack(): void {
    this.router.navigate(ROUTES.RECURSOS_HUMANOS.EXPEDIENTES);
  }

  getSeverityBadge(severity: string): string {
    const map: Record<string, string> = {
      Low: "bg-sky-100 text-sky-700",
      Moderate: "bg-amber-100 text-amber-700",
      Medium: "bg-red-100 text-red-700",
      High: "bg-red-100 text-red-700",
    };
    return map[severity] ?? "bg-slate-100 text-slate-700";
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      Aprobada: "bg-green-100 text-green-700",
      Pendiente: "bg-amber-100 text-amber-700",
      Rechazada: "bg-red-100 text-red-700",
      Cancelada: "bg-slate-100 text-slate-600",
      Activa: "bg-green-100 text-green-700",
      Completada: "bg-sky-100 text-sky-700",
    };
    return map[status] ?? "bg-slate-100 text-slate-700";
  }
}
