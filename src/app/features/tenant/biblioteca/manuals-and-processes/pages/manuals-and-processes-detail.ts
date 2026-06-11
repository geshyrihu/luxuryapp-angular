import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ImageModule } from "primeng/image";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { CustomButton } from "src/app/core/components/buttons/web";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { PrintService } from "src/app/core/services/print.service";
import { DiagramPreviewComponent } from "../components/diagram-preview";
import { IManualTemplateDetalleDTO } from "../models/manuals-and-processes.dto";

@Component({
  selector: "app-manuals-and-processes-detail",
  templateUrl: "./manuals-and-processes-detail.html",
  styleUrls: [],

  imports: [
    CommonModule,
    ButtonModule,
    ImageModule,
    TagModule,
    DiagramPreviewComponent,
    AppIcon,
    CustomButton,
  ],
})
export class ManualsAndProcessesDetail implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private printS = inject(PrintService);
  public aspRoleS = inject(AspRoleService);

  readonly EApplicationRole = EApplicationRole;
  readonly logoPath = "assets/images/LBG-negro.png";

  isAdmin = computed(() => {
    const roles = [
      EApplicationRole.SuperUsuario,
      EApplicationRole.Legal,
      EApplicationRole.RecursosHumanos,
      EApplicationRole.Reclutamiento,
    ];
    return roles.some((role) => this.aspRoleS.roleSignal(role)());
  });

  manual = signal<IManualTemplateDetalleDTO | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.onLoadData(id);
  }

  getPeriodicityReadable(manual: IManualTemplateDetalleDTO | null): string {
    if (!manual) return "";

    let base = manual.periodicityName || "A Demanda";
    if (manual.periodicity === 0) return "A Demanda";
    if (manual.periodicity === 1) return "Única Vez";
    if (manual.periodicity === 2) return "Diario";

    // Semanal
    if (manual.periodicity === 3) {
      if (manual.executionDaysOfWeek?.length) {
        const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const selected = manual.executionDaysOfWeek
          .map((d) => days[d])
          .join(", ");
        return `Semanal (${selected})`;
      }
      return "Semanal";
    }

    // Mensual
    if (manual.periodicity === 4) {
      if (manual.executionDayOfMonth) {
        return `Mensual (Día ${manual.executionDayOfMonth})`;
      }
      if (manual.executionWeekOfMonth && manual.executionDaysOfWeek?.length) {
        const weeks = ["1ra", "2da", "3ra", "4ta", "Última"];
        const days = [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ];
        const wk = weeks[manual.executionWeekOfMonth - 1] || "Semana";
        const d = days[manual.executionDaysOfWeek[0]];
        return `Mensual (${wk} semana, el ${d})`;
      }
      return "Mensual";
    }

    // Anual
    if (manual.periodicity === 5) {
      if (manual.executionMonthOfYear) {
        const months = [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ];
        const m = months[manual.executionMonthOfYear - 1];
        if (manual.executionDayOfMonth) {
          return `Anual (Cada ${manual.executionDayOfMonth} de ${m})`;
        }
        return `Anual (En ${m})`;
      }
      return "Anual";
    }

    return base;
  }

  onLoadData(id: string) {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<IManualTemplateDetalleDTO>(Endpoints.ManualsPasos.getById(id))
      .then((result) => {
        this.manual.set(result ?? null);
        this.loading.set(false);
      });
  }

  onBack() {
    this.router.navigate(["/library/manuals-and-processes"]);
  }

  onOpenEditor(id: string) {
    this.router.navigate(["/library/manuals-and-processes/editor", id]);
  }

  async descargarPDF() {
    const data = this.manual();
    if (data) {
      this.printS.printElement(undefined, data.folio || "Manual de Proceso");
    }
  }

  manualStatusLabel(): string {
    return this.manual()?.isActive ? "Vigente" : "Inactivo";
  }

  scopeLabel(): string {
    return this.manual()?.isGlobal ? "Global" : "Segmentado";
  }

  visibilityLabel(): string {
    const data = this.manual();
    if (!data) return "Sin definir";
    if (data.isGlobal) return "Todos los condominios";
    if (data.customerIds?.length)
      return `${data.customerIds.length} condominios`;
    return "Sin clientes asignados";
  }

  audienceLabel(): string {
    const count = this.manual()?.roleIds?.length ?? 0;
    return count ? `${count} roles autorizados` : "Sin roles asignados";
  }

  displayStepNumber(pasoId: string): number {
    const pasos = this.manual()?.pasos ?? [];
    let visibleIndex = 0;

    for (const paso of pasos) {
      if (paso.tipoNota === 0) {
        visibleIndex++;
      }

      if (paso.id === pasoId) {
        return visibleIndex;
      }
    }

    return visibleIndex;
  }

  noteLabel(tipoNota: number): string {
    switch (tipoNota) {
      case 1:
        return "Nota";
      case 2:
        return "Advertencia";
      case 3:
        return "Buenas Practicas";
      default:
        return "Paso";
    }
  }

  noteEmoji(tipoNota: number): string {
    switch (tipoNota) {
      case 1:
        return "ℹ️";
      case 2:
        return "⚠️";
      case 3:
        return "✅";
      default:
        return "•";
    }
  }

  noteClass(tipoNota: number): string {
    switch (tipoNota) {
      case 1:
        return "border-round-xl border-1 p-4";
      case 2:
        return "border-round-xl border-1 p-4";
      case 3:
        return "border-round-xl border-1 p-4";
      default:
        return "surface-ground border-round-xl border-1 surface-border p-4";
    }
  }

  noteBackground(tipoNota: number): string {
    switch (tipoNota) {
      case 1:
        return "#eff6ff";
      case 2:
        return "#fffbeb";
      case 3:
        return "#f0fdf4";
      default:
        return "transparent";
    }
  }

  noteBorder(tipoNota: number): string {
    switch (tipoNota) {
      case 1:
        return "#60a5fa";
      case 2:
        return "#f59e0b";
      case 3:
        return "#4ade80";
      default:
        return "transparent";
    }
  }

  safeUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;
    let embedUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
      embedUrl = url.replace("youtube.com/watch?v=", "youtube.com/embed/");
      const amp = embedUrl.indexOf("&");
      if (amp !== -1) embedUrl = embedUrl.substring(0, amp);
    } else if (url.includes("youtu.be/")) {
      embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
      const q = embedUrl.indexOf("?");
      if (q !== -1) embedUrl = embedUrl.substring(0, q);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
