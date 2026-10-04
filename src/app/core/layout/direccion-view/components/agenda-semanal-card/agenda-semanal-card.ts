import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { AgendaSemanal } from "../agenda-semanal/agenda-semanal";
import type { AgendaSemanalEventDto } from "../agenda-semanal/agenda-semanal.model";

@Component({
  selector: "app-agenda-semanal-card",
  templateUrl: "./agenda-semanal-card.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppIcon, ButtonWeb],
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
      this.dialogHandlerS.sizeXl,
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
      Endpoints.DireccionDashboard.agendaSemanal(hoy),
      false,
    );
    this.eventos.set(data ?? []);
    this.cargando.set(false);
  }
}
