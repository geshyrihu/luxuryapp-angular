import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { InputTextModule } from "primeng/inputtext";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DatePickerModule } from "primeng/datepicker";
import { CardModule } from "primeng/card";
import { SkeletonModule } from "primeng/skeleton";
import { ApiResponseService } from "src/app/core/services/api-response.service";

// ─── Modelos ─────────────────────────────────────────────────────────────────

/** Representa un registro de email transaccional de Brevo */
interface BrevoEmailLogDTO {
  messageId: string;
  email: string;
  subject: string;
  event: string;
  date: string;
  from: string;
  templateId: number | null;
  tags: string[];
}

/** Respuesta paginada del servidor */
interface BrevoPagedResultDTO {
  totalCount: number;
  items: BrevoEmailLogDTO[];
}

/**
 * Componente para visualizar los logs de emails transaccionales desde la API de Brevo.
 * Se conecta al backend como proxy seguro en lugar de usar un iframe.
 */
@Component({
  selector: "app-brevo-email-logs",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    InputTextModule,
    CustomButton,
    DatePickerModule,
    CardModule,
    SkeletonModule,
  ],
  templateUrl: "./brevo-email-logs.html",
})
export class BrevoEmailLogs implements OnInit {
  private readonly apiS = inject(ApiResponseService);

  // ─── Estado del componente ────────────────────────────────────────────────
  registros    = signal<BrevoEmailLogDTO[]>([]);
  totalRecords = signal<number>(0);
  cargando     = signal<boolean>(false);

  // ─── Filtros de búsqueda ──────────────────────────────────────────────────
  filtroEmail      = "";
  filtroFechaInicio: Date | null = null;
  filtroFechaFin:   Date | null = null;

  // ─── Paginación ───────────────────────────────────────────────────────────
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
      limit:  String(this.tamanioPagina),
      offset: String(this.offset),
    };

    if (this.filtroEmail?.trim())
      params["email"] = this.filtroEmail.trim();

    if (this.filtroFechaInicio)
      params["startDate"] = this.formatearFecha(this.filtroFechaInicio);

    if (this.filtroFechaFin)
      params["endDate"] = this.formatearFecha(this.filtroFechaFin);

    const resultado = await this.apiS.onGetItem<BrevoPagedResultDTO>(
      `brevo-email-log?${new URLSearchParams(params).toString()}`
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
    this.filtroEmail       = "";
    this.filtroFechaInicio = null;
    this.filtroFechaFin    = null;
    this.offset            = 0;
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
   * Devuelve la severidad del Tag de PrimeNG según el evento de Brevo.
   */
  severidadEvento(evento: string): "success" | "info" | "warn" | "danger" | "secondary" {
    const mapa: Record<string, "success" | "info" | "warn" | "danger" | "secondary"> = {
      delivered:     "success",
      opened:        "info",
      clicked:       "info",
      sent:          "secondary",
      queued:        "secondary",
      softBounce:    "warn",
      hardBounce:    "danger",
      blocked:       "danger",
      invalid_email: "danger",
      deferred:      "warn",
      complaint:     "warn",
      unsubscribed:  "secondary",
      spam:          "danger",
      proxy_open:    "secondary",
    };
    return mapa[evento] ?? "secondary";
  }

  /**
   * Etiqueta legible en español para cada tipo de evento de Brevo.
   */
  etiquetaEvento(evento: string): string {
    const mapa: Record<string, string> = {
      delivered:     "Entregado",
      opened:        "Abierto",
      clicked:       "Clic",
      sent:          "Enviado",
      queued:        "En cola",
      softBounce:    "Rebote suave",
      hardBounce:    "Rebote duro",
      blocked:       "Bloqueado",
      invalid_email: "Email inválido",
      deferred:      "Diferido",
      complaint:     "Queja",
      unsubscribed:  "Desuscrito",
      spam:          "Spam",
      proxy_open:    "Apertura proxy",
    };
    return mapa[evento] ?? evento;
  }

  // ─── Utilitarios privados ─────────────────────────────────────────────────

  /** Formatea una fecha al formato YYYY-MM-DD que acepta la API de Brevo. */
  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().split("T")[0];
  }
}
