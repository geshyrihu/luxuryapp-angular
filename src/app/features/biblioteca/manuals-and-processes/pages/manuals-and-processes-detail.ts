import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ImageModule } from "primeng/image";
import { TagModule } from "primeng/tag";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DiagramPreviewComponent } from "../components/diagram-preview";
import { IManualTemplateDetalleDTO } from "../models/manuals-and-processes.dto";

@Component({
  selector: "app-manuals-and-processes-detail",
  templateUrl: "./manuals-and-processes-detail.html",

  imports: [
    CommonModule,
    ButtonModule,
    ImageModule,
    TagModule,
    DiagramPreviewComponent,
  ],
})
export class ManualsAndProcessesDetail implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public aspRoleS = inject(AspRoleService);

  readonly EApplicationRole = EApplicationRole;
  readonly logoPath = "assets/images/LBG-negro.png";

  manual = signal<IManualTemplateDetalleDTO | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.onLoadData(id);
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
    if (data.customerIds?.length) return `${data.customerIds.length} condominios`;
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
}
