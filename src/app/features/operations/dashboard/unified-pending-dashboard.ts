import { CommonModule } from "@angular/common";
import {
  Component,
  effect,
  inject,
  input,
  signal,
  viewChild,
  ChangeDetectionStrategy
} from "@angular/core";
import { Router } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { CardModule } from "primeng/card";
import { IconFieldModule } from "primeng/iconfield";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ActionIconsGroupComponent } from "@ui/shared/action-icons-group/action-icons-group.component";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { AiService } from "src/app/core/services/ai.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SwalService } from "src/app/core/services/swal.service";
import { TaskForm } from "src/app/features/operations/task-engine/tasks/task-message/pages/task-form";
import { ImageAnalysisDialogComponent } from "src/app/shared/components/image-analysis-dialog/image-analysis-dialog.component";
import Swal from "sweetalert2";
import { PendingItemDTO } from "./models/pending-item.dto";

// Recruitment Dialog Components
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TicketLegalForm } from "src/app/features/legal/asuntos-legales-y-seguros/ticket-legal/ticket-legal-form";
import { ServiceOrderForm } from "src/app/features/operations/field-service/service-order/service-order-form";
import { MinutaDetalleForm } from "src/app/features/operations/meetings/juntas-comite/junta-comite-minutas/minuta-detalle-form";
import { SolicitudAltaStatusForm } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/recruitment-requests/components/solicitud-alta-status-form";
import { SolicitudBajaUpdateStatus } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/request-dismissal/components/solicitud-baja-update-status";
import { ModificacionSalarioForm } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/salary-modification/components/modificacion-salario-form";
import { VacanteForm } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/vacancy-requests/components/vacante-form";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-unified-pending-dashboard",
  imports: [
    WebButtonIcon,
    CommonModule,
    TableModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    CardModule,
    AvatarModule,
    WebButtonLabel,
    TooltipModule,
    PrimeNgCustomTableFooter,
    PrimeNgCustomCaption,
    ImageAnalysisDialogComponent,
    ActionIconsGroupComponent,
    AppIcon,
  ],
  templateUrl: "./unified-pending-dashboard.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
      }
      .module-badge {
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
    `,
  ],
})
export class UnifiedPendingDashboard {
  visionDialog = viewChild.required(ImageAnalysisDialogComponent);

  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router);
  private aiService = inject(AiService);
  private swalService = inject(SwalService);
  public aspRoleS = inject(AspRoleService);
  tableScrollHeightS = inject(TableScrollHeightService);

  visibleModules = input<string[]>([]);

  public AspRole = EApplicationRole;

  data = signal<PendingItemDTO[]>([]);
  allData: PendingItemDTO[] = []; // Store full data
  loading = signal<boolean>(false);
  loadedCustomerId = signal<string | null>(null);

  // Table Options
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();

  // Usar el servicio global para scrollHeight
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  uniqueModules = signal<{ name: string; count: number; emoji: string }[]>([]);
  selectedModule = signal<string | null>(null);

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.loadData(customerId);
      }
    });

    effect(() => {
      // Re-filter when visibleModules changes, if needed (though usually static per session)
      if (this.allData.length > 0) {
        this.filterData();
      }
    });
  }

  loadData(customerId: string) {
    this.loading.set(true);
    this.allData = [];
    this.data.set([]);
    this.loadedCustomerId.set(customerId);

    const url = `Dashboard/GlobalPendingItems/${customerId}`;

    this.apiResponseS
      .onGetList(url)
      .then((items: any) => {
        let loadedItems = (items || []) as PendingItemDTO[];

        // Calculate daysOpen for each item to enable sorting
        loadedItems = loadedItems.map((item) => {
          if (item.module === "Polizas") {
            item.daysOpen = -1;
          } else {
            const today = new Date();
            const creationDate = new Date(item.date);
            const diffTime = Math.abs(today.getTime() - creationDate.getTime());
            item.daysOpen = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          return item;
        });

        this.allData = loadedItems;

        // Extract unique modules and counts
        const grouped = this.allData.reduce(
          (acc, item) => {
            const existing = acc.find((m) => m.name === item.module);
            if (existing) {
              existing.count++;
            } else {
              acc.push({
                name: item.module,
                count: 1,
                emoji: this.getModuleEmoji(item.module),
              });
            }
            return acc;
          },
          [] as { name: string; count: number; emoji: string }[],
        );

        this.uniqueModules.set(grouped);
        this.filterData();
      })
      .catch((err) => {
        console.error("Error loading dashboard items", err);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  getDaysSinceFollowup(item: PendingItemDTO): number {
    if (item.module !== "Tickets" && item.module !== "Minutas") return 0;

    let refDateString = item.lastFollowupDate || item.date;
    if (!refDateString) return 0;

    const today = new Date();
    const refDate = new Date(refDateString);
    const diffTime = Math.abs(today.getTime() - refDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isSevere(item: PendingItemDTO): boolean {
    return this.getDaysSinceFollowup(item) > 8;
  }

  isWarning(item: PendingItemDTO): boolean {
    const days = this.getDaysSinceFollowup(item);
    return days >= 7 && days <= 8;
  }

  filterData() {
    let filtered = this.allData;

    if (this.visibleModules().length > 0) {
      filtered = filtered.filter((item) =>
        this.visibleModules().some(
          (m) => m.toLowerCase() === item.module.toLowerCase(),
        ),
      );
    }

    if (this.selectedModule()) {
      filtered = filtered.filter(
        (item) => item.module === this.selectedModule(),
      );
    }

    this.data.set(filtered);
  }

  onModuleFilterChange(module: string | null) {
    this.selectedModule.set(module);
    this.filterData();
  }

  onModalForm(data: any) {
    // This dashboard aggregates multiple modules.
    // Generic creation logic or a selector dialog could go here.
    console.log("onModalForm called with:", data);
  }

  getSeverity(
    status: string,
  ): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
    const s = status.toLowerCase();
    if (s.includes("concluido") || s.includes("activo")) return "success";
    if (s.includes("pendiente")) return "warn";
    if (s.includes("proceso")) return "info";
    if (s.includes("vener") || s.includes("vencido")) return "danger";
    return "secondary";
  }

  getModuleSeverity(
    module: string,
  ): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    switch (module.toLowerCase()) {
      case "tickets":
        return "info";
      case "minutas":
        return "warning";
      case "mantenimiento":
        return "success"; // or another color
      case "legal":
        return "danger";
      case "polizas":
        return "info";
      // Recruitment
      case "bajas":
        return "danger";
      case "altas":
        return "success";
      case "vacantes":
        return "info";
      case "modificaciones":
        return "warning";
      default:
        return "secondary";
    }
  }

  getModuleEmoji(module: string): string {
    switch (module.toLowerCase()) {
      case "tickets":
        return "🎫";
      case "minutas":
        return "📝";
      case "mantenimiento":
        return "🔧";
      case "legal":
        return "⚖️";
      case "polizas":
        return "📄";
      // Recruitment
      case "bajas":
        return "📉";
      case "altas":
        return "🚀";
      case "vacantes":
        return "🪑";
      case "modificaciones":
        return "💰";
      default:
        return "📌";
    }
  }

  onNavigate(item: PendingItemDTO) {
    if (item.module.toLowerCase() === "legal") {
      this.openLegalTicketDialog(item);
      return;
    }

    if (item.urlRoute) {
      this.router.navigateByUrl(item.urlRoute);
      return;
    }

    switch (item.module.toLowerCase()) {
      case "tickets":
        this.openTicketDialog(item);
        break;
      case "mantenimiento":
        this.openServiceOrderDialog(item);
        break;
      case "minutas":
        this.openMinutaDialog(item);
        break;
      // Recruitment
      case "bajas":
        this.dialogHandlerS
          .openDialog(
            SolicitudBajaUpdateStatus,
            { id: item.id, status: Number(item.metadata?.["statusId"] || 0) },
            "Actualizar Estatus Baja",
            this.dialogHandlerS.sizeMd,
          )
          .then((res) => {
            if (res) this.loadData(this.customerIdS.customerId());
          });
        break;
      case "altas":
        this.dialogHandlerS
          .openDialog(
            SolicitudAltaStatusForm,
            {
              id: item.id,
              employeeName: item.metadata?.["employeeName"] || "",
              status: Number(item.metadata?.["statusId"] || 0),
            },
            "Estatus Solicitud de Alta",
            this.dialogHandlerS.sizeMd,
          )
          .then((res) => {
            if (res) this.loadData(this.customerIdS.customerId());
          });
        break;
      case "vacantes":
        this.dialogHandlerS
          .openDialog(
            VacanteForm,
            {
              id: item.id,
              workPositionId: item.metadata?.["workPositionId"] || 0,
            },
            "Editar Vacante",
            this.dialogHandlerS.sizeLg,
          )
          .then((res) => {
            if (res) this.loadData(this.customerIdS.customerId());
          });
        break;
      case "modificaciones":
        this.dialogHandlerS
          .openDialog(
            ModificacionSalarioForm,
            { id: item.id },
            "Modificación Salarial",
            this.dialogHandlerS.sizeLg,
          )
          .then((res) => {
            if (res) this.loadData(this.customerIdS.customerId());
          });
        break;

      default:
        // Already handled URL check at top
        break;
    }
  }

  openLegalTicketDialog(item: PendingItemDTO) {
    this.dialogHandlerS
      .openDialog(
        TicketLegalForm,
        { id: item.id },
        "Ticket Legal",
        this.dialogHandlerS.sizeLg,
      )
      .then((res) => {
        if (res) this.loadData(this.customerIdS.customerId());
      });
  }

  openTicketDialog(item: PendingItemDTO) {
    if (!item.metadata || !item.metadata["ticketGroupId"]) return;

    this.dialogHandlerS
      .openDialog(
        TaskForm,
        {
          id: item.id,
          ticketGroupId: item.metadata["ticketGroupId"],
        },
        item.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((res) => {
        if (res) this.loadData(this.customerIdS.customerId());
      });
  }

  openServiceOrderDialog(item: PendingItemDTO) {
    this.dialogHandlerS
      .openDialog(
        ServiceOrderForm,
        { id: item.id },
        "Orden de Servicio", // Title could be dynamic
        this.dialogHandlerS.sizeLg,
      )
      .then((res) => {
        if (res) this.loadData(this.customerIdS.customerId());
      });
  }

  openMinutaDialog(item: PendingItemDTO) {
    if (
      !item.metadata ||
      !item.metadata["meetingId"] ||
      !item.metadata["areaResponsable"]
    )
      return;

    this.dialogHandlerS
      .openDialog(
        MinutaDetalleForm,
        {
          id: item.id,
          meetingId: item.metadata["meetingId"],
          areaResponsable: Number(item.metadata["areaResponsable"]),
        },
        "Detalle de Minuta",
        this.dialogHandlerS.sizeLg, // Or customized size
      )
      .then((res) => {
        if (res) this.loadData(this.customerIdS.customerId());
      });
  }

  async generateDailyReport() {
    try {
      const currentCustomerId = this.customerIdS.customerId();

      // Validar si el cliente ha cambiado o si aún estamos cargando datos
      if (
        this.loading() ||
        this.loadedCustomerId() !== currentCustomerId ||
        this.data().length === 0
      ) {
        this.swalService.fire({
          title: "Dashboard en actualización",
          text: "Estamos sincronizando los datos del cliente. Por favor intenta de nuevo en unos segundos.",
          icon: "info",
        });
        return;
      }

      this.swalService.showLoading("Analizando tu Dashboard con IA...");

      // 1. Serializar contexto (ahorrando tokens)
      const context = this.data()
        .slice(0, 50) // Limite de seguridad
        .map(
          (i) =>
            `- [${i.module}] ${i.title} (Fecha: ${i.formattedDate}, Estatus: ${i.status}, Prioridad: ${i.priority})`,
        )
        .join("\n");

      // 2. Llamar al servicio
      const htmlResult = await this.aiService.analyzeDashboard(
        context,
        currentCustomerId,
      );

      // 3. Mostrar resultado
      Swal.fire({
        title: "📄 Informe Ejecutivo Diario",
        html: htmlResult,
        icon: "info",
        width: "100%",
        showConfirmButton: true,
        confirmButtonText: "Entendido",
        customClass: {
          popup: "ai-summary-popup",
        },
      });
    } catch (error) {
      console.error(error);
      this.swalService.error(
        "Error de Análisis",
        "No se pudo generar el informe. Por favor intenta más tarde.",
      );
    }
  }

  sendExecutiveReport() {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) return;

    this.swalService.showLoading("Enviando reporte ejecutivo...");

    this.apiResponseS
      .onPost(`Dashboard/SendExecutiveReport/${customerId}`, {})
      .then(() => {
        this.swalService.success(
          "Reporte Enviado",
          "El reporte ejecutivo semanal ha sido enviado a los administradores y gerentes.",
        );
      })
      .catch((error) => {
        console.error(error);
        this.swalService.error(
          "Error de Envío",
          "No se pudo enviar el reporte. Intenta nuevamente.",
        );
      });
  }

  openVision() {
    this.visionDialog().show();
  }

  onVisionResult(analysis: string) {
    // En el dashboard solo mostramos el resultado
    Swal.fire({
      title: "🔍 Diagnóstico Visual",
      text: analysis,
      icon: "info",
      width: "600px",
    });
  }
}
