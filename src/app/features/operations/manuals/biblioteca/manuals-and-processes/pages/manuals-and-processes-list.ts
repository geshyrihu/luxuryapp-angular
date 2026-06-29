import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import {
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/web/buttons";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomSearchInput } from "src/app/core/components/web/inputs/custom-search-input-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { IManualTemplateSimpleDTO } from "../models/manuals-and-processes.dto";
import { ManualsAndProcessesForm } from "./manuals-and-processes-form";

interface DeptConfig {
  icon: string;
  color: string;
  bgColor: string;
}

interface DeptGroup {
  dept: string;
  manuals: IManualTemplateSimpleDTO[];
  config: DeptConfig;
}

@Component({
  selector: "app-manuals-and-processes-list",
  templateUrl: "./manuals-and-processes-list.html",
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    CustomSearchInput,
    CustomButton,
    CustomButtonDelete,
    CustomButtonEdit,
    DataViewMobile,
    IonItem,
    IonLabel,
    AppIcon,
  ],
})
export class ManualsAndProcessesList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  public aspRoleS = inject(AspRoleService);
  private dialogHandlerS = inject(DialogHandlerService);

  readonly EApplicationRole = EApplicationRole;

  isAdmin = computed(() => {
    const roles = [
      EApplicationRole.SuperUsuario,
      EApplicationRole.Legal,
      EApplicationRole.RecursosHumanos,
      EApplicationRole.Reclutamiento,
    ];
    return roles.some((role) => this.aspRoleS.roleSignal(role)());
  });

  dataSignal = signal<IManualTemplateSimpleDTO[]>([]);
  loading = signal(true);
  searchTerm = signal("");

  private readonly DEPT_CONFIG: Record<string, DeptConfig> = {
    Administracion: {
      icon: "mdi:office-building",
      color: "#1e40af",
      bgColor: "#dbeafe",
    },
    Legal: { icon: "mdi:shield", color: "#7c2d12", bgColor: "#ffedd5" },
    Contabilidad: {
      icon: "mdi:wallet",
      color: "#0f766e",
      bgColor: "#ccfbf1",
    },
    Mantenimiento: {
      icon: "mdi:wrench",
      color: "#92400e",
      bgColor: "#fef3c7",
    },
    Limpieza: { icon: "mdi:star", color: "#065f46", bgColor: "#d1fae5" },
    Operaciones: { icon: "mdi:cog", color: "#1e3a8a", bgColor: "#e0e7ff" },
    Jardineria: { icon: "mdi:sun-bright", color: "#15803d", bgColor: "#dcfce7" },
    Sistemas: { icon: "mdi:monitor", color: "#6d28d9", bgColor: "#f5f3ff" },
    Seguridad: { icon: "mdi:lock", color: "#dc2626", bgColor: "#fee2e2" },
    Constructora: { icon: "mdi:home", color: "#7c3aed", bgColor: "#ede9fe" },
    Supervision: { icon: "mdi:eye", color: "#0891b2", bgColor: "#cffafe" },
    Direccion: { icon: "mdi:account", color: "#374151", bgColor: "#f3f4f6" },
    "Recursos Humanos": {
      icon: "mdi:account-group",
      color: "#d97706",
      bgColor: "#fef3c7",
    },
    Reclutamiento: {
      icon: "mdi:briefcase",
      color: "#0284c7",
      bgColor: "#e0f2fe",
    },
    Recepcion: { icon: "mdi:phone", color: "#047857", bgColor: "#d1fae5" },
    Mensajeria: {
      icon: "mdi:email",
      color: "#0369a1",
      bgColor: "#e0f2fe",
    },
    Ludoteca: { icon: "mdi:heart", color: "#db2777", bgColor: "#fce7f3" },
    "N/A": {
      icon: "mdi:minus-circle-outline",
      color: "#6b7280",
      bgColor: "#f3f4f6",
    },
  };

  private readonly DEFAULT_CONFIG: DeptConfig = {
    icon: "mdi:folder",
    color: "#6b7280",
    bgColor: "#f3f4f6",
  };

  ngOnInit(): void {
    this.onLoadData();
  }

  private normalizeDeptKey(value: string | null | undefined): string {
    const normalized = (value || "N/A")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return normalized || "N/A";
  }

  groupedData = computed<DeptGroup[]>(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const items = this.dataSignal().filter(
      (m) =>
        !term ||
        m.folio.toLowerCase().includes(term) ||
        (m.description ?? "").toLowerCase().includes(term) ||
        m.departament.toLowerCase().includes(term),
    );
    const map = new Map<string, IManualTemplateSimpleDTO[]>();
    for (const item of items) {
      const dept = item.departament || "N/A";
      if (!map.has(dept)) map.set(dept, []);
      map.get(dept)!.push(item);
    }
    return Array.from(map.entries()).map(([dept, manuals]) => ({
      dept,
      manuals,
      config: this.DEPT_CONFIG[this.normalizeDeptKey(dept)] ?? this.DEFAULT_CONFIG,
    }));
  });

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<IManualTemplateSimpleDTO[]>(Endpoints.ManualsPasos.getAll)
      .then((result) => {
        this.dataSignal.set(result ?? []);
        this.loading.set(false);
      });
  }

  onViewTemplate(id: string) {
    this.router.navigate(["/library/manuals-and-processes/detail", id]);
  }

  onOpenEditor(id: string) {
    this.router.navigate(["/library/manuals-and-processes/editor", id]);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ManualsAndProcessesForm,
        data,
        data?.id ? "Editar Manual" : "Nuevo Manual",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(data: any) {
    this.apiResponseS
      .onDelete(Endpoints.ManualsPasos.delete(data.id))
      .then((res) => {
        if (res) {
          this.dataSignal.update((current) =>
            current.filter((i) => i.id !== data.id),
          );
        }
      });
  }
}

