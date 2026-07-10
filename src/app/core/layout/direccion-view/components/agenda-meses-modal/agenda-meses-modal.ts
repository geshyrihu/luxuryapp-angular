import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type { AgendaSemanalEventDTO } from "../agenda-semanal/agenda-semanal.model";

interface MesGroup {
  label: string;
  eventos: AgendaSemanalEventDTO[];
}

@Component({
  selector: "app-agenda-meses-modal",
  templateUrl: "./agenda-meses-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, TagModule, TooltipModule, WebButtonLabel],
})
export class AgendaMesesModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);

  eventos = signal<AgendaSemanalEventDTO[]>([]);
  cargando = signal<boolean>(false);
  mesesSeleccionados = signal<number>(6);

  eventosPorMes = computed<MesGroup[]>(() => {
    const map = new Map<string, MesGroup>();
    this.eventos().forEach((e) => {
      const fecha = new Date(e.startAt);
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
      if (!map.has(key)) {
        map.set(key, {
          label: fecha.toLocaleDateString("es-MX", {
            month: "long",
            year: "numeric",
          }),
          eventos: [],
        });
      }
      map.get(key)!.eventos.push(e);
    });
    return Array.from(map.values());
  });

  totalEventos = computed(() => this.eventos().length);

  ngOnInit(): void {
    this.cargar();
  }

  cambiarMeses(meses: number): void {
    this.mesesSeleccionados.set(meses);
    this.cargar();
  }

  cerrar(): void {
    this.ref.close();
  }

  getModalityClass(modality: string): "success" | "info" | "warn" {
    if (modality.toLowerCase().includes("vir")) return "info";
    if (modality.toLowerCase().includes("pre")) return "success";
    return "warn";
  }

  formatFechaHora(isoStr: string): string {
    const d = new Date(isoStr);
    return (
      d.toLocaleDateString("es-MX", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }) +
      " " +
      d.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    const data = await this.apiResponseS.onGetItem<AgendaSemanalEventDTO[]>(
      `direccion-dashboard/agenda-meses?meses=${this.mesesSeleccionados()}`,
      false,
    );
    this.eventos.set(data ?? []);
    this.cargando.set(false);
  }
}
