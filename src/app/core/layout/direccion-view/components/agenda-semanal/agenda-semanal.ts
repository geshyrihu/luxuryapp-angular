import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { WebButtonIcon } from "@ui/buttons/web-icon";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TagModule } from "primeng/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { DialogSize } from "src/app/core/interfaces/dialog-size.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AgendaMesesModal } from "../agenda-meses-modal/agenda-meses-modal";
import type {
  AgendaDiaGroup,
  AgendaSemanalEventDto,
} from "./agenda-semanal.model";

@Component({
  selector: "app-agenda-semanal",
  templateUrl: "./agenda-semanal.html",
  imports: [
    TagModule,
    LxTooltipDirective,
    AppIcon,
    WebButtonLabel,
    WebButtonIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .agenda-hoy-badge {
        background: rgba(255, 255, 255, 0.2);
        color: var(--ds-text-inverse, #edf0ff);
      }
    `,
  ],
})
export class AgendaSemanal {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);

  fechaReferencia = signal<Date>(new Date());
  eventos = signal<AgendaSemanalEventDto[]>([]);
  cargando = signal<boolean>(false);

  rangoLabel = computed(() => {
    const lunes = this.calcularLunes(this.fechaReferencia());
    const fin = new Date(lunes);
    fin.setDate(lunes.getDate() + 13);
    return `${this.formatCorto(lunes)} - ${this.formatCorto(fin)} ${fin.getFullYear()}`;
  });

  esPeriodoActual = computed(() => {
    const lunesHoy = this.calcularLunes(new Date()).toDateString();
    const lunesRef = this.calcularLunes(this.fechaReferencia()).toDateString();
    return lunesHoy === lunesRef;
  });

  diasPeriodo = computed<AgendaDiaGroup[]>(() => {
    const lunes = this.calcularLunes(this.fechaReferencia());
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return Array.from({ length: 14 }, (_, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      const fechaStr = fecha.toISOString().slice(0, 10);

      return {
        label: fecha.toLocaleDateString("es-MX", {
          weekday: "long",
          day: "2-digit",
          month: "short",
        }),
        fecha,
        esHoy: fecha.getTime() === hoy.getTime(),
        eventos: this.eventos().filter((e) => e.startAt.startsWith(fechaStr)),
      };
    });
  });

  totalEventos = computed(() => this.eventos().length);

  constructor() {
    effect(() => {
      const fecha = this.fechaReferencia();
      this.cargar(fecha);
    });
  }

  periodoAnterior(): void {
    const d = new Date(this.fechaReferencia());
    d.setDate(d.getDate() - 14);
    this.fechaReferencia.set(d);
  }

  periodoSiguiente(): void {
    const d = new Date(this.fechaReferencia());
    d.setDate(d.getDate() + 14);
    this.fechaReferencia.set(d);
  }

  volverHoy(): void {
    this.fechaReferencia.set(new Date());
  }

  abrirVistasMeses(): void {
    this.dialogHandlerS.openDialog(
      AgendaMesesModal,
      null,
      "Agenda de eventos proximos",
      DialogSize.lg,
    );
  }

  getModalityClass(modality: string): "success" | "info" | "warn" {
    if (modality.toLowerCase().includes("vir")) return "info";
    if (modality.toLowerCase().includes("pre")) return "success";
    return "warn";
  }

  formatHora(isoStr: string): string {
    return new Date(isoStr).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  private async cargar(fecha: Date): Promise<void> {
    this.cargando.set(true);
    const fechaStr = fecha.toISOString().slice(0, 10);
    const data = await this.apiResponseS.onGetItem<AgendaSemanalEventDto[]>(
      `direccion-dashboard/agenda-semanal?fecha=${fechaStr}`,
      false,
    );
    this.eventos.set(data ?? []);
    this.cargando.set(false);
  }

  private calcularLunes(fecha: Date): Date {
    const d = new Date(fecha);
    d.setHours(0, 0, 0, 0);
    const dia = d.getDay();
    d.setDate(d.getDate() + (dia === 0 ? -6 : 1 - dia));
    return d;
  }

  private formatCorto(fecha: Date): string {
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
    });
  }
}
