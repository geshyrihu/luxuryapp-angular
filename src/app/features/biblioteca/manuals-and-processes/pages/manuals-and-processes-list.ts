import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import {
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/buttons/web";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
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

import { IonItem, IonLabel } from "@ionic/angular/standalone";
import {
  IonButtonDelete,
  IonButtonEdit,
} from "src/app/core/components/buttons/mobile";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";

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
    IonButtonEdit,
    IonButtonDelete,
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
    Administración: {
      icon: "pi pi-building",
      color: "#1e40af",
      bgColor: "#dbeafe",
    },
    Legal: { icon: "pi pi-shield", color: "#7c2d12", bgColor: "#ffedd5" },
    Contabilidad: {
      icon: "pi pi-wallet",
      color: "#0f766e",
      bgColor: "#ccfbf1",
    },
    Mantenimiento: {
      icon: "pi pi-wrench",
      color: "#92400e",
      bgColor: "#fef3c7",
    },
    Limpieza: { icon: "pi pi-star", color: "#065f46", bgColor: "#d1fae5" },
    Operaciones: { icon: "pi pi-cog", color: "#1e3a8a", bgColor: "#e0e7ff" },
    Jardinería: { icon: "pi pi-sun", color: "#15803d", bgColor: "#dcfce7" },
    Sistemas: { icon: "pi pi-desktop", color: "#6d28d9", bgColor: "#f5f3ff" },
    Seguridad: { icon: "pi pi-lock", color: "#dc2626", bgColor: "#fee2e2" },
    Constructora: { icon: "pi pi-home", color: "#7c3aed", bgColor: "#ede9fe" },
    Supervisión: { icon: "pi pi-eye", color: "#0891b2", bgColor: "#cffafe" },
    Dirección: { icon: "pi pi-user", color: "#374151", bgColor: "#f3f4f6" },
    "Recursos Humanos": {
      icon: "pi pi-users",
      color: "#d97706",
      bgColor: "#fef3c7",
    },
    Reclutamiento: {
      icon: "pi pi-briefcase",
      color: "#0284c7",
      bgColor: "#e0f2fe",
    },
    Recepción: { icon: "pi pi-phone", color: "#047857", bgColor: "#d1fae5" },
    Mensajería: {
      icon: "pi pi-envelope",
      color: "#0369a1",
      bgColor: "#e0f2fe",
    },
    Ludoteca: { icon: "pi pi-heart", color: "#db2777", bgColor: "#fce7f3" },
    "N/A": { icon: "pi pi-minus-circle", color: "#6b7280", bgColor: "#f3f4f6" },
  };

  private readonly DEFAULT_CONFIG: DeptConfig = {
    icon: "pi pi-folder",
    color: "#6b7280",
    bgColor: "#f3f4f6",
  };

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
      config: this.DEPT_CONFIG[dept] ?? this.DEFAULT_CONFIG,
    }));
  });

  ngOnInit(): void {
    this.onLoadData();
  }

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
