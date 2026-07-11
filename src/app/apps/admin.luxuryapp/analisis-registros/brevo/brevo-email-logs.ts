import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { BrevoEmailLogDto } from "./interfaces/brevo-email-log.interface";
import { BrevoPagedResultDto } from "./interfaces/brevo-paged-result.interface";

/** Componente para visualizar los logs de emails transaccionales desde la API de Brevo.
 * Se conecta al backend como proxy seguro en lugar de usar un iframe.
 */
@Component({
  selector: "app-brevo-email-logs",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    LxTag,
    AppIcon,
    WebButtonLabel,
    CustomInputDateSignal,
    CustomInputTextSignal,
    LxSkeleton,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./brevo-email-logs.html",
})
export class BrevoEmailLogs implements OnInit {
  private readonly apiS = inject(ApiResponseService);

  // --- Estado del componente ------------------------------------------------
  registros = signal<BrevoEmailLogDto[]>([]);
  totalRecords = signal<number>(0);
  cargando = signal<boolean>(false);

  // --- Filtros de bósqueda --------------------------------------------------
  filtroEmail = "";
  filtroFechaInicioCtrl = new FormControl<string | null>(null);
  filtroFechaFinCtrl = new FormControl<string | null>(null);

  // --- Paginación -----------------------------------------------------------
  readonly tamanioPagina = 50;
  offset = 0;

  ngOnInit(): void {
    this.cargarLogs();
  }

  /**
   * Carga los logs de Brevo desde el endpoint del backend.
   */
  async cargarLogs(): Promise<void> {
    this.cargando.set(true);

    const params: Record<string, string> = {
      limit: String(this.tamanioPagina),
      offset: String(this.offset),
    };

    if (this.filtroEmail?.trim()) params["email"] = this.filtroEmail.trim();

    if (this.filtroFechaInicioCtrl.value)
      params["startDate"] = this.filtroFechaInicioCtrl.value;

    if (this.filtroFechaFinCtrl.value)
      params["endDate"] = this.filtroFechaFinCtrl.value;

    const resultado = await this.apiS.onGetItem<BrevoPagedResultDto>(
      `brevo-email-log?${new URLSearchParams(params).toString()}`,
    );

    if (resultado) {
      this.registros.set(resultado.items ?? []);
      this.totalRecords.set(resultado.totalCount ?? 0);
    }

    this.cargando.set(false);
  }

  /**
   * Aplica los filtros y reinicia la paginación desde el inicio.
   */
  aplicarFiltros(): void {
    this.offset = 0;
    this.cargarLogs();
  }

  /**
   * Limpia todos los filtros y vuelve a cargar.
   */
  limpiarFiltros(): void {
    this.filtroEmail = "";
    this.filtroFechaInicioCtrl.reset();
    this.filtroFechaFinCtrl.reset();
    this.offset = 0;
    this.cargarLogs();
  }

  /**
   * Maneja el cambio de página del p-table lazy.
   */
  alCambiarPagina(evento: { first: number; rows: number }): void {
    this.offset = evento.first;
    this.cargarLogs();
  }

  /**
   * Devuelve la severidad del Tag de PrimeNG segón el evento de Brevo.
   */
  severidadEvento(
    evento: string,
  ): "success" | "info" | "warn" | "danger" | "secondary" {
    const mapa: Record<
      string,
      "success" | "info" | "warn" | "danger" | "secondary"
    > = {
      delivered: "success",
      opened: "info",
      clicked: "info",
      sent: "secondary",
      queued: "secondary",
      softBounce: "warn",
      hardBounce: "danger",
      blocked: "danger",
      invalid_email: "danger",
      deferred: "warn",
      complaint: "warn",
      unsubscribed: "secondary",
      spam: "danger",
      proxy_open: "secondary",
    };
    return mapa[evento] ?? "secondary";
  }

  /**
   * Etiqueta legible en espaóol para cada tipo de evento de Brevo.
   */
  etiquetaEvento(evento: string): string {
    const mapa: Record<string, string> = {
      delivered: "Entregado",
      opened: "Abierto",
      clicked: "Clic",
      sent: "Enviado",
      queued: "En cola",
      softBounce: "Rebote suave",
      hardBounce: "Rebote duro",
      blocked: "Bloqueado",
      invalid_email: "Email invólido",
      deferred: "Diferido",
      complaint: "Queja",
      unsubscribed: "Desuscrito",
      spam: "Spam",
      proxy_open: "Apertura proxy",
    };
    return mapa[evento] ?? evento;
  }

  // --- Utilitarios privados -------------------------------------------------

  /** Formatea una fecha al formato YYYY-MM-DD que acepta la API de Brevo. */
}
