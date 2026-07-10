import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TooltipModule } from "primeng/tooltip";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type { TareasLegalResumenDTO } from "./tareas-legal-card.model";

@Component({
  selector: "app-tareas-legal-card",
  templateUrl: "./tareas-legal-card.html",
  imports: [CommonModule, TooltipModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .text-ds-danger {
        color: var(--ds-danger);
      }
    `,
  ],
})
export class TareasLegalCard implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  resumen = signal<TareasLegalResumenDTO | null>(null);
  cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargar();
  }

  formatFechaRelativa(iso: string | null): string {
    if (!iso) return "";
    const d = new Date(iso);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diff = Math.floor((hoy.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return "hoy";
    if (diff === 1) return "ayer";
    if (diff < 7) return `hace ${diff}d`;
    return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    const data = await this.apiResponseS.onGetItem<TareasLegalResumenDTO>(
      "direccion-dashboard/tareas-legal",
      false,
    );
    this.resumen.set(data ?? null);
    this.cargando.set(false);
  }
}
