import { CommonModule } from "@angular/common";
import { Component, effect, inject, Input, signal } from "@angular/core";
import { Router } from "@angular/router";
import {
  IonBadge,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  alertCircleOutline,
  briefcaseOutline,
  buildOutline,
  clipboardOutline,
  documentTextOutline,
  hammerOutline,
  peopleOutline,
  sparkles,
  ticketOutline,
} from "ionicons/icons";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { AiService } from "src/app/core/services/ai.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SwalService } from "src/app/core/services/swal.service";
import { MinutaDetalleForm } from "src/app/features/juntas-comite/junta-comite-minutas/minuta-detalle-form";
import { ServiceOrderForm } from "src/app/features/service-order/service-order-form";
import { TaskForm } from "src/app/features/tasks/task-message/pages/task-form";
import Swal from "sweetalert2";
import { TicketLegalForm } from "../legal/ticket-legal/ticket-legal-form";
import { PendingItemDTO } from "./models/pending-item.dto";
@Component({
  selector: "app-unified-pending-dashboard-mobile",
  imports: [
    CommonModule,
    DataViewMobile,
    IonItem,
    IonLabel,
    IonIcon,
    IonBadge,
    IonChip,
  ],
  templateUrl: "./unified-pending-dashboard-mobile.html",
  styles: [
    `
      .ai-summary-popup {
        font-size: 0.9rem !important;
      }
    `,
  ],
})
export class UnifiedPendingDashboardMobile {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private router = inject(Router);
  private dialogHandlerS = inject(DialogHandlerService);
  private aiService = inject(AiService);
  private swalService = inject(SwalService);
  @Input() visibleModules: string[] = [];

  data = signal<PendingItemDTO[]>([]);
  allData: PendingItemDTO[] = [];
  loading = signal<boolean>(false);
  loadedCustomerId = signal<string | null>(null);

  uniqueModules = signal<string[]>([]);
  selectedModule = signal<string | null>(null);

  constructor() {
    addIcons({
      ticketOutline,
      documentTextOutline,
      buildOutline,
      briefcaseOutline,
      clipboardOutline,
      peopleOutline,
      hammerOutline,
      sparkles,
      alertCircleOutline,
    });

    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.loadData(customerId);
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
        this.allData = (items || []) as PendingItemDTO[];

        // Extract unique modules for the filter
        const modules = [...new Set(this.allData.map((item) => item.module))];
        this.uniqueModules.set(modules);

        this.filterData();
      })
      .catch((err) => {
        console.error("Error loading dashboard items", err);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  filterData() {
    let filtered = this.allData;

    // 1. Filter by visibleModules input (if provided)
    if (this.visibleModules.length > 0) {
      filtered = filtered.filter((item) =>
        this.visibleModules.some(
          (m) => m.toLowerCase() === item.module.toLowerCase(),
        ),
      );
    }

    // 2. Filter by selected module chip
    if (this.selectedModule()) {
      filtered = filtered.filter(
        (item) => item.module === this.selectedModule(),
      );
    }

    this.data.set(filtered);
  }

  onModuleFilterChange(module: string | null) {
    if (this.selectedModule() === module) {
      // Toggle off if clicking the same one (optional ux) or just re-select
      // Here we treat 'null' as 'All'
      this.selectedModule.set(null);
    } else {
      this.selectedModule.set(module);
    }
    this.filterData();
  }

  // Helper to group data by Module for DataViewMobile
  get groupedData() {
    const grouped: any = {};
    const items = this.data();

    // Group by Module
    items.forEach((item) => {
      if (!grouped[item.module]) {
        grouped[item.module] = [];
      }
      grouped[item.module].push(item);
    });

    return grouped;
  }

  onNavigate(item: PendingItemDTO) {
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
      case "legal":
        this.openLegalTicketDialog(item);
        break;
      case "polizas":
      default:
        if (item.urlRoute) {
          this.router.navigateByUrl(item.urlRoute);
        }
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

  // Reuse dialog logic (can be extracted to a shared service later if needed)
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
        "Orden de Servicio",
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
        this.dialogHandlerS.sizeLg,
      )
      .then((res) => {
        if (res) this.loadData(this.customerIdS.customerId());
      });
  }

  async generateDailyReport() {
    try {
      const currentCustomerId = this.customerIdS.customerId();

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

      // 1. Serializar contexto
      const context = this.data()
        .slice(0, 50)
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
        width: "100%", // Mobile width
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

  onModalForm(event: any) {
    // Create logic if needed
  }

  getModuleIcon(module: string): string {
    switch (module.toLowerCase()) {
      case "tickets":
        return "ticket-outline";
      case "minutas":
        return "document-text-outline";
      case "mantenimiento":
        return "build-outline";
      case "legal":
        return "briefcase-outline";
      case "polizas":
        return "clipboard-outline";
      case "reclutamiento":
        return "people-outline";
      default:
        return "hammer-outline";
    }
  }

  getModuleColor(module: string): string {
    switch (module.toLowerCase()) {
      case "tickets":
        return "primary"; // blue
      case "minutas":
        return "warning"; // yellow
      case "mantenimiento":
        return "success"; // green
      case "legal":
        return "danger"; // red
      default:
        return "medium";
    }
  }

  getSeverityColor(status: string): string {
    const s = status.toLowerCase();
    if (s.includes("concluido") || s.includes("activo")) return "success";
    if (s.includes("pendiente")) return "warning";
    if (s.includes("proceso")) return "primary";
    if (s.includes("vencido")) return "danger";
    return "medium";
  }
}
