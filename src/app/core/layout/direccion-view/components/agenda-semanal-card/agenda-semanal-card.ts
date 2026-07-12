import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DialogSize } from "src/app/core/interfaces/dialog-size.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AgendaSemanal } from "../agenda-semanal/agenda-semanal";
import type { AgendaSemanalEventDto } from "../agenda-semanal/agenda-semanal.model";

@Component({
  selector: "app-agenda-semanal-card",
  templateUrl: "./agenda-semanal-card.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppIcon, WebButtonLabel],
})
export class AgendaSemanalCard implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);

  eventos = signal<AgendaSemanalEventDto[]>([]);
  cargando = signal<boolean>(false);

  totalEventos = computed(() => this.eventos().length);

  proximosEventos = computed(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return this.eventos()
      .filter((e) => new Date(e.startAt) >= hoy)
      .slice(0, 3);
  });

  proximoEvento = computed(() => this.proximosEventos()[0] ?? null);

  ngOnInit(): void {
    this.cargar();
  }

  abrirAgenda(): void {
    this.dialogHandlerS.openDialog(
      AgendaSemanal,
      null,
      "Agenda - Juntas con Comite",
      DialogSize.lg,
    );
  }

  formatFechaCorta(isoStr: string): string {
    const d = new Date(isoStr);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    const fecha = new Date(d);
    fecha.setHours(0, 0, 0, 0);

    let prefijo =
      fecha.getTime() === hoy.getTime()
        ? "Hoy"
        : fecha.getTime() === manana.getTime()
          ? "Manana"
          : d.toLocaleDateString("es-MX", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            });

    const hora = d.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${prefijo} ${hora}`;
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    const hoy = new Date().toISOString().slice(0, 10);
    const data = await this.apiResponseS.onGetItem<AgendaSemanalEventDto[]>(
      `direccion-dashboard/agenda-semanal?fecha=${hoy}`,
      false,
    );
    this.eventos.set(data ?? []);
    this.cargando.set(false);
  }
}
