import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  WebButtonLabelDelete,
  WebButtonLabelEdit,
} from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";
import { IManualTemplateSimpleDTO } from "./interfaces/manuals-and-processes.dto";
import { ManualsAndProcessesForm } from "./manuals-and-processes-form";

interface DeptConfig {
  icon: AppIconName;
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ButtonModule,
    CustomSearchInput,
    WebButtonLabel,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    DataViewMobile,
    AppIcon,
    MobileListItem,
  ],
})
export class ManualsAndProcessesList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  public aspRoleS = inject(AspRoleService);
  private dialogHandlerS = inject(DialogHandlerService);

  readonly ApplicationRole = ApplicationRole;

  isAdmin = computed(() => {
    const roles = [
      ApplicationRole.SuperUsuario,
      ApplicationRole.Legal,
      ApplicationRole.RecursosHumanos,
      ApplicationRole.Reclutamiento,
    ];
    return roles.some((role) => this.aspRoleS.roleSignal(role)());
  });

  dataSignal = signal<IManualTemplateSimpleDTO[]>([]);
  loading = signal(true);
  searchTerm = signal("");

  private readonly DEPT_CONFIG: Record<string, DeptConfig> = {
    Administracion: {
      icon: "material-symbols-light:apartment",
      color: "#1e40af",
      bgColor: "#dbeafe",
    },
    Legal: { icon: "material-symbols-light:security", color: "#7c2d12", bgColor: "#ffedd5" },
    Contabilidad: {
      icon: "material-symbols-light:wallet",
      color: "#0f766e",
      bgColor: "#ccfbf1",
    },
    Mantenimiento: {
      icon: "material-symbols-light:apartment",
      color: "#92400e",
      bgColor: "#fef3c7",
    },
    Limpieza: { icon: "material-symbols-light:star", color: "#065f46", bgColor: "#d1fae5" },
    Operaciones: { icon: "material-symbols-light:settings", color: "#1e3a8a", bgColor: "#e0e7ff" },
    Jardineria: {
      icon: "material-symbols-light:sunny",
      color: "#15803d",
      bgColor: "#dcfce7",
    },
    Sistemas: { icon: "material-symbols-light:desktop-windows", color: "#6d28d9", bgColor: "#f5f3ff" },
    Seguridad: { icon: "material-symbols-light:lock", color: "#dc2626", bgColor: "#fee2e2" },
    Constructora: { icon: "material-symbols-light:home", color: "#7c3aed", bgColor: "#ede9fe" },
    Supervision: { icon: "material-symbols-light:visibility", color: "#0891b2", bgColor: "#cffafe" },
    Direccion: { icon: "material-symbols-light:person", color: "#374151", bgColor: "#f3f4f6" },
    "Recursos Humanos": {
      icon: "material-symbols-light:group",
      color: "#d97706",
      bgColor: "#fef3c7",
    },
    Reclutamiento: {
      icon: "material-symbols-light:work",
      color: "#0284c7",
      bgColor: "#e0f2fe",
    },
    Recepcion: { icon: "material-symbols-light:call", color: "#047857", bgColor: "#d1fae5" },
    Mensajeria: {
      icon: "material-symbols-light:mail",
      color: "#0369a1",
      bgColor: "#e0f2fe",
    },
    Ludoteca: { icon: "material-symbols-light:favorite", color: "#db2777", bgColor: "#fce7f3" },
    "N/A": {
      icon: "material-symbols-light:do-not-disturb-on",
      color: "#6b7280",
      bgColor: "#f3f4f6",
    },
  };

  private readonly DEFAULT_CONFIG: DeptConfig = {
    icon: "material-symbols-light:folder",
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
      config:
        this.DEPT_CONFIG[this.normalizeDeptKey(dept)] ?? this.DEFAULT_CONFIG,
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
    this.router.navigate(ROUTES.BIBLIOTECA.MANUAL_DETALLE(id));
  }

  onOpenEditor(id: string) {
    this.router.navigate(ROUTES.BIBLIOTECA.MANUAL_EDITOR(id));
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
